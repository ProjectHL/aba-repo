import { readFile } from "node:fs/promises"
import path from "node:path"

const templatePath = path.resolve("nginx", "aba-data-hub.conf.template")
const template = await readFile(templatePath, "utf8")

for (const requiredRule of [
  "listen 80;",
  "return 308 https://$host$request_uri;",
  "listen 443 ssl http2;",
  "ssl_certificate __TLS_CERTIFICATE_PATH__;",
  "ssl_certificate_key __TLS_PRIVATE_KEY_PATH__;",
  "try_files $uri =404;",
  "try_files $uri $uri/ /index.html;",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "X-Robots-Tag",
  "Content-Security-Policy",
  "https://arfwuctpwnnuhdgjtxaa.supabase.co",
]) {
  if (!template.includes(requiredRule)) {
    throw new Error(`La plantilla Nginx no cumple: ${requiredRule}`)
  }
}

if (!template.includes("__APP_HOST__") || !template.includes("__RELEASE_ROOT__")) {
  throw new Error("La plantilla debe conservar placeholders, no dominio ni ruta reales")
}

console.log("Plantilla Nginx VPS aprobada para configuración futura")
