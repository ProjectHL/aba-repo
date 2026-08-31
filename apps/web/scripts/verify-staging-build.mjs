import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const buildDirectory = path.resolve(process.argv[2] ?? "dist")
const forbiddenPatterns = [
  { label: "service role", pattern: /service[_-]?role/i },
  { label: "secret key", pattern: /sb_secret_[A-Za-z0-9_-]+/ },
  { label: "JWT literal", pattern: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/ },
]

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await collectFiles(entryPath)))
    else files.push(entryPath)
  }

  return files
}

const files = await collectFiles(buildDirectory)
const indexPath = path.join(buildDirectory, "index.html")
const indexHtml = await readFile(indexPath, "utf8")
const headers = await readFile(path.join(buildDirectory, "_headers"), "utf8")
const redirects = await readFile(path.join(buildDirectory, "_redirects"), "utf8")
await readFile(path.join(buildDirectory, "404.html"), "utf8")
const worker = await readFile(path.join(buildDirectory, "server", "index.js"), "utf8")
const javascript = (
  await Promise.all(
    files
      .filter(
        (file) =>
          file.endsWith(".js") && path.relative(buildDirectory, file).split(path.sep)[0] === "assets",
      )
      .map((file) => readFile(file, "utf8").catch(() => "")),
  )
).join("\n")

if (!/<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(indexHtml)) {
  throw new Error("El artefacto no declara noindex, nofollow")
}

for (const requiredHeader of [
  "Content-Security-Policy:",
  "Cache-Control: no-store",
  "X-Content-Type-Options: nosniff",
  "X-Robots-Tag: noindex, nofollow",
  "Strict-Transport-Security:",
]) {
  if (!headers.includes(requiredHeader)) {
    throw new Error(`Falta el header obligatorio: ${requiredHeader}`)
  }
}

if (!redirects.includes("/assets/* /404.html 404") || !redirects.includes("/* /index.html 200")) {
  throw new Error("El fallback SPA no protege los errores de assets")
}

if (!javascript.includes("https://arfwuctpwnnuhdgjtxaa.supabase.co")) {
  throw new Error("El artefacto no contiene la configuración pública de Supabase staging; use --mode staging")
}

const supportedWorker = worker.includes("const FILES =") && worker.includes("function decode(value)")

if (!supportedWorker) {
  throw new Error("El Worker de Sites debe ser autocontenido; el binding de assets no está verificado")
}

for (const workerContract of ["pathname.startsWith(\"/assets/\")", "frame-ancestors 'none'"]) {
  if (!worker.includes(workerContract)) {
    throw new Error(`El Worker de Sites no cumple: ${workerContract}`)
  }
}

for (const file of files) {
  const content = await readFile(file, "utf8").catch(() => "")
  for (const forbidden of forbiddenPatterns) {
    if (forbidden.pattern.test(content)) {
      throw new Error(`Patrón prohibido detectado (${forbidden.label}) en ${path.relative(buildDirectory, file)}`)
    }
  }
}

console.log(`Preflight staging aprobado: ${files.length} archivos inspeccionados`)
