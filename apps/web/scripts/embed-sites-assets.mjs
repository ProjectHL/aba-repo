import { promises as fs } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
}

async function walkFiles(root, directory = root) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walkFiles(root, absolutePath)))
    else files.push(path.relative(root, absolutePath).replaceAll(path.sep, "/"))
  }

  return files
}

function workerSource(files) {
  return `const FILES = ${JSON.stringify(files)}

const SECURITY_HEADERS = ${JSON.stringify({
    "Cache-Control": "no-store",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' https://arfwuctpwnnuhdgjtxaa.supabase.co; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Robots-Tag": "noindex, nofollow",
  })}

function decode(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

function respond(file, status = 200, method = "GET") {
  const headers = new Headers(SECURITY_HEADERS)
  if (file?.type) headers.set("Content-Type", file.type)
  return new Response(method === "HEAD" || !file ? null : decode(file.body), { status, headers })
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") return respond(null, 405, request.method)
    const pathname = new URL(request.url).pathname
    const direct = FILES[pathname === "/" ? "/index.html" : pathname]
    if (direct) return respond(direct, 200, request.method)
    if (pathname.startsWith("/assets/")) return respond(null, 404, request.method)
    return respond(FILES["/index.html"], 200, request.method)
  },
}
`
}

export async function embedSitesAssets(inputDirectory, outputFile) {
  const existingOutput = await fs.stat(outputFile).catch((error) => {
    if (error?.code === "ENOENT") return null
    throw error
  })
  if (existingOutput) throw new Error(`El destino ya existe y no se sobrescribirá: ${outputFile}`)

  const excluded = new Set(["_headers", "_redirects", "server/index.js"])
  const relativeFiles = (await walkFiles(inputDirectory)).filter(
    (file) => !excluded.has(file) && !file.startsWith(".openai/")
  )
  const files = {}

  for (const relativeFile of relativeFiles) {
    const extension = path.extname(relativeFile).toLowerCase()
    files[`/${relativeFile}`] = {
      body: (await fs.readFile(path.join(inputDirectory, relativeFile))).toString("base64"),
      type: CONTENT_TYPES[extension] ?? "application/octet-stream",
    }
  }

  if (!files["/index.html"]) throw new Error("El build no contiene index.html")
  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  await fs.writeFile(outputFile, workerSource(files), { flag: "wx" })
  return { files: Object.keys(files).length, outputFile }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const [, , inputDirectory, outputFile] = process.argv
  if (!inputDirectory || !outputFile) {
    throw new Error("Uso: node scripts/embed-sites-assets.mjs <build-dir> <worker-output>")
  }
  const result = await embedSitesAssets(path.resolve(inputDirectory), path.resolve(outputFile))
  console.log(`Worker autocontenido creado: ${result.files} archivos`)
}
