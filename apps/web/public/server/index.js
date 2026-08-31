const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' https://arfwuctpwnnuhdgjtxaa.supabase.co; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow",
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request, env) {
    if (!env?.ASSETS?.fetch) {
      return withSecurityHeaders(new Response("Servicio no disponible", { status: 503 }))
    }

    const url = new URL(request.url)
    const assetResponse = await env.ASSETS.fetch(request)

    if (assetResponse.status !== 404 || url.pathname.startsWith("/assets/")) {
      return withSecurityHeaders(assetResponse)
    }

    const indexUrl = new URL("/index.html", url)
    const indexRequest = new Request(indexUrl, request)
    return withSecurityHeaders(await env.ASSETS.fetch(indexRequest))
  },
}
