/**
 * Normalizes login/register API bodies that may use different envelope shapes.
 */
export function extractAuthPayload(body) {
  if (!body || typeof body !== "object") {
    return null;
  }
  const nested = body.data;
  if (nested && typeof nested === "object" && nested.token && nested.user) {
    return { token: nested.token, user: nested.user };
  }
  if (body.token && body.user) {
    return { token: body.token, user: body.user };
  }
  if (body.accessToken && body.user) {
    return { token: body.accessToken, user: body.user };
  }
  return null;
}
