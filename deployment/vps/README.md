# Paquete VPS privado de ABA Data Hub

Este proyecto construye un artefacto estático para Nginx. No contiene Worker de Sites, credenciales
privilegiadas ni instrucciones para publicar.

## Construcción local

Desde `apps/web`, generar un release nuevo y fechado con:

```powershell
node .\node_modules\vite\bin\vite.js build --config vite.vps.config.ts --mode staging --outDir ..\..\deployment\vps\releases\<release-fechado> --emptyOutDir false
node ..\..\deployment\vps\scripts\verify-vps-release.mjs ..\..\deployment\vps\releases\<release-fechado>
node ..\..\deployment\vps\scripts\verify-nginx-template.mjs
```

El release se aprueba sólo si la verificación confirma `index.html`, assets, headers, fallback SPA,
404 de assets y ausencia de `server/index.js`.

## Activación futura

La configuración Nginx de `nginx/aba-data-hub.conf.template` es una plantilla sin dominio ni
certificados reales. La activación en un VPS requiere autorización explícita, HTTPS funcional y el
origen exacto registrado en Supabase staging. No reemplazar ni borrar releases previos.
