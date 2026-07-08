// Minimal Google Sheets API client for Cloudflare Workers, authenticating
// as a service account. No external libraries — everything here uses the
// Web Crypto API, which is available natively in the Workers runtime.
//
// Flow:
//   1. Build a signed JWT (RS256) asserting who we are (the service account)
//   2. Exchange that JWT for a short-lived OAuth2 access token from Google
//   3. Use the access token to call the Sheets API's values.append endpoint
//
// Required secrets (set via `wrangler secret put <NAME>`, never committed):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL — the service account's client_email
//   GOOGLE_PRIVATE_KEY           — the service account's private_key (PEM)
//   GOOGLE_SHEET_ID              — the spreadsheet ID (from its URL)

function base64UrlEncode(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeString(str) {
  return base64UrlEncode(new TextEncoder().encode(str));
}

// Converts a PEM-formatted private key (as stored in the Google service
// account JSON file) into a CryptoKey usable for signing.
async function importPrivateKey(pem) {
  const pemBody = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');

  const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function getAccessToken(env) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const nowSeconds = Math.floor(Date.now() / 1000);
  const claims = {
    iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  };

  const unsignedJwt =
    base64UrlEncodeString(JSON.stringify(header)) +
    '.' +
    base64UrlEncodeString(JSON.stringify(claims));

  const privateKey = await importPrivateKey(env.GOOGLE_PRIVATE_KEY);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(unsignedJwt)
  );

  const signedJwt = unsignedJwt + '.' + base64UrlEncode(new Uint8Array(signature));

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Google token exchange failed: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Appends one or more rows to the given sheet tab (e.g. "Confirmados").
// `rows` is an array of arrays — each inner array is one row's cell values.
export async function appendRows(env, sheetName, rows) {
  const accessToken = await getAccessToken(env);

  const range = `${sheetName}!A:Z`;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}` +
    `/values/${encodeURIComponent(range)}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ values: rows }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sheets append failed: ${errorText}`);
  }

  return response.json();
}
