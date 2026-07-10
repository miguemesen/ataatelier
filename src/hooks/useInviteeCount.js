// Reads ?invitees=<n> from the URL. Always returns a whole number between
// 1 and 7 — falls back to 1 if the parameter is missing, not a number, or
// out of range.
export function useInviteeCount() {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('invitees')
  const parsed = parseInt(raw, 10)

  if (!Number.isFinite(parsed)) return 1
  if (parsed < 1) return 1
  if (parsed > 7) return 7
  return parsed
}