// Cloudflare Worker script — only invoked for requests matching the
// run_worker_first routes configured in wrangler.jsonc ("/rsvp" and
// "/api/rsvp-submit"). Every other request (images, JS/CSS bundles, the
// homepage) is served directly as a static asset and never reaches this
// file.

import { appendRows } from './googleSheets.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/rsvp-submit' && request.method === 'POST') {
      return handleRsvpSubmit(request, env);
    }

    return handleRsvpPage(request, env);
  },
};

// ---------- RSVP data submission → Google Sheets ----------
async function handleRsvpSubmit(request, env) {
  const corsHeaders = {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  };

  try {
    const body = await request.json();
    const eventSlug = body.eventSlug || '';
    const timestamp = new Date().toISOString();

    if (body.type === 'confirm') {
      const groupId = crypto.randomUUID();
      const guests = Array.isArray(body.guests) ? body.guests : [];
      const notes = body.notes || '';

      const rows = guests.map((guest) => [
        timestamp,
        eventSlug,
        groupId,
        guest.nombre || '',
        guest.apellidos || '',
        guest.edad || '',
        notes,
      ]);

      if (rows.length > 0) {
        await appendRows(env, 'Confirmados', rows);
      }
    } else if (body.type === 'decline') {
      const row = [
        timestamp,
        eventSlug,
        body.nombre || '',
        body.apellidos || '',
        body.mensaje || '',
      ];

      await appendRows(env, 'No Asisten', [row]);
    } else {
      return new Response(JSON.stringify({ error: 'Unknown submission type' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// ---------- WhatsApp / social preview tags for /rsvp ----------
// WhatsApp (and Facebook/Instagram/iMessage) preview crawlers only read the
// raw HTML of a page — they don't run JavaScript. Since the actual invitation
// content is loaded dynamically via React based on the ?e= parameter, we
// intercept /rsvp requests here, look up that event's config.json, and
// inject the right Open Graph / Twitter meta tags into the HTML before
// returning it. Everything else about the page (images, music, buttons)
// still works exactly the same, driven by the client-side React app.
async function handleRsvpPage(request, env) {
    const url = new URL(request.url);
    const eventSlug = url.searchParams.get('e');

    // Fetch the built rsvp page from static assets
    const templateUrl = new URL('/rsvp/index.html', url.origin);
    const templateResponse = await env.ASSETS.fetch(templateUrl.toString());
    let html = await templateResponse.text();

    // Sensible defaults in case there's no slug or the config can't be read
    let title = 'Invitación';
    let description = '¡Estás invitado/a! Confirma tu asistencia aquí.';
    let imageUrl = null;

    if (eventSlug) {
      try {
        const configUrl = new URL(`/events/${eventSlug}/config.json`, url.origin);
        const configResponse = await env.ASSETS.fetch(configUrl.toString());
        if (configResponse.ok) {
          const config = await configResponse.json();
          if (config.pageTitle) title = config.pageTitle;
          if (config.ogDescription) description = config.ogDescription;
          if (config.invitationImage) {
            imageUrl = new URL(
              `/events/${eventSlug}/${config.invitationImage}`,
              url.origin
            ).toString();
          }
        }
      } catch (err) {
        // Fall back to defaults defined above
      }
    }

    const escapeHtml = (str) =>
      String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const metaTags = [
      `<meta property="og:type" content="website">`,
      `<meta property="og:url" content="${escapeHtml(url.toString())}">`,
      `<meta property="og:title" content="${escapeHtml(title)}">`,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
      imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}">` : '',
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${escapeHtml(title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
      imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">` : ''
    ]
      .filter(Boolean)
      .join('\n    ');

    html = html.replace('</head>', `    ${metaTags}\n  </head>`);
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'no-store'
      }
    });
}