import assert from "node:assert/strict"

import worker from "../public/server/index.js"

const requests = []
const env = {
  ASSETS: {
    async fetch(request) {
      const pathname = new URL(request.url).pathname
      requests.push(pathname)
      if (pathname === "/index.html") {
        return new Response("<!doctype html><title>ABA</title>", {
          headers: { "Content-Type": "text/html" },
        })
      }
      return new Response("missing", { status: 404 })
    },
  },
}

const spaResponse = await worker.fetch(new Request("https://staging.example/clientes/abc"), env)
assert.equal(spaResponse.status, 200)
assert.deepEqual(requests, ["/clientes/abc", "/index.html"])
assert.equal(spaResponse.headers.get("X-Robots-Tag"), "noindex, nofollow")
assert.equal(spaResponse.headers.get("Cache-Control"), "no-store")
assert.match(spaResponse.headers.get("Content-Security-Policy"), /frame-ancestors 'none'/)

requests.length = 0
const assetResponse = await worker.fetch(
  new Request("https://staging.example/assets/missing.js"),
  env,
)
assert.equal(assetResponse.status, 404)
assert.deepEqual(requests, ["/assets/missing.js"])
assert.equal(assetResponse.headers.get("X-Content-Type-Options"), "nosniff")
assert.equal(assetResponse.headers.get("Cache-Control"), "no-store")

console.log("Worker de Sites aprobado: fallback SPA y 404 de assets")
