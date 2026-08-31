import { access, readFile, stat } from "node:fs/promises"
import path from "node:path"

const releaseDirectory = path.resolve(process.argv[2] ?? "")

if (!process.argv[2]) {
  throw new Error("Indica el directorio de release VPS a verificar")
}

async function requireFile(relativePath) {
  const target = path.join(releaseDirectory, relativePath)
  await access(target)
  return target
}

await stat(releaseDirectory)
const indexPath = await requireFile("index.html")
await requireFile("404.html")
await requireFile("_headers")
await requireFile("_redirects")
await stat(path.join(releaseDirectory, "assets"))

try {
  await access(path.join(releaseDirectory, "server", "index.js"))
  throw new Error("El release VPS no puede incluir el Worker de Sites ni el binding ASSETS")
} catch (error) {
  if (error instanceof Error && error.message.includes("no puede incluir")) throw error
}

const indexHtml = await readFile(indexPath, "utf8")
const headers = await readFile(path.join(releaseDirectory, "_headers"), "utf8")
const redirects = await readFile(path.join(releaseDirectory, "_redirects"), "utf8")

if (!/noindex, nofollow/i.test(indexHtml)) {
  throw new Error("El release VPS debe conservar noindex, nofollow")
}

for (const requiredHeader of [
  "Content-Security-Policy:",
  "Cache-Control: no-store",
  "X-Content-Type-Options: nosniff",
  "X-Robots-Tag: noindex, nofollow",
]) {
  if (!headers.includes(requiredHeader)) {
    throw new Error(`Falta el header requerido: ${requiredHeader}`)
  }
}

if (!redirects.includes("/assets/* /404.html 404") || !redirects.includes("/* /index.html 200")) {
  throw new Error("El release VPS no conserva el contrato de fallback SPA y 404 de assets")
}

console.log("Release VPS estático aprobado")
