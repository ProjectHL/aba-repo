import { promises as fs } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const [, , workerPath] = process.argv
if (!workerPath) throw new Error("Uso: node scripts/verify-embedded-sites-worker.mjs <worker>")

const absoluteWorkerPath = path.resolve(workerPath)
const worker = (await import(`${pathToFileURL(absoluteWorkerPath).href}?v=${Date.now()}`)).default
const root = await worker.fetch(new Request("https://staging.example/"))
const rootHtml = await root.text()
const assetPath = rootHtml.match(/(?:src|href)="(\/assets\/[^"]+)"/)?.[1]
if (!assetPath) throw new Error("El HTML no referencia un asset versionado")

const asset = await worker.fetch(new Request(`https://staging.example${assetPath}`))
const detail = await worker.fetch(
  new Request("https://staging.example/clientes/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")
)
const missingAsset = await worker.fetch(new Request("https://staging.example/assets/missing.js"))

const failures = [
  root.status !== 200 && "root no responde 200",
  !rootHtml.includes("noindex") && "root no contiene noindex",
  root.headers.get("cache-control") !== "no-store" && "falta no-store",
  !root.headers.get("content-security-policy") && "falta CSP",
  asset.status !== 200 && "asset versionado no responde 200",
  detail.status !== 200 && "fallback SPA no responde 200",
  missingAsset.status !== 404 && "asset ausente no responde 404",
].filter(Boolean)

if (failures.length) throw new Error(failures.join("; "))
const size = (await fs.stat(absoluteWorkerPath)).size
console.log(`Worker autocontenido aprobado: ${size} bytes`)
