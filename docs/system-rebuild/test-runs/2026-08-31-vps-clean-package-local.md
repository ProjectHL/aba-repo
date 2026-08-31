# Paquete VPS limpio — validación local

Fecha: 2026-08-31  
Alcance: preparación exclusivamente local; no se creó VPS, DNS, credencial, despliegue ni mutación
remota.

## Resultado

Se generó un release estático independiente de Sites en
`deployment/vps/releases/s-aba-03-vps-clean-20260831`. El release no contiene `server/index.js`,
por lo que no depende del Worker de Sites ni del binding `ASSETS` que bloqueaba el preflight anterior.

## Evidencia de validación

| Gate | Resultado |
| --- | --- |
| Prueba roja del verificador | esperada: el release inexistente devolvió `ENOENT` antes de construirlo |
| Build VPS estático | verde; Vite compiló 2302 módulos con `vite.vps.config.ts` |
| Verificador del release | verde: `Release VPS estático aprobado` |
| Plantilla Nginx | verde: HTTPS futuro, headers, fallback SPA y 404 de assets verificados estáticamente |
| Suite | 34 archivos, 148/148 pruebas verdes |
| Typecheck | verde |
| Lint | verde, sin diagnósticos |

El verificador exige `index.html`, `404.html`, headers, redirects, assets, contrato SPA/404 y la
ausencia del Worker de Sites.

## Contenido del proyecto limpio

- `deployment/vps/README.md`: proceso local y límites de activación.
- `deployment/vps/nginx/aba-data-hub.conf.template`: plantilla sin dominio ni certificados reales.
- `deployment/vps/.env.example`: sólo variables públicas de staging con valores de ejemplo.
- `deployment/vps/scripts/verify-vps-release.mjs`: preflight local del release.
- `apps/web/vite.vps.config.ts` y `apps/web/public-vps/`: build estático sin el plugin/Worker de
  Sites.

## Browser y estado remoto

El navegador confirmó que la versión 14 privada sigue mostrando el error de validación del fixture
`E2E-SABA03-20260831`. No se pulsó de nuevo el formulario, no se creó el fixture y no se hizo
ninguna consulta o escritura en `ABA_staging` durante este gate.

## P1/P2 y siguiente gate

- P1 Sites: el preflight del artefacto para Sites sigue fallando; queda fuera de la ruta VPS y no se
  publica por ese canal.
- P1 E2E: pendiente hasta servir el release VPS privado y revalidar el formulario corregido.
- P2: el chunk principal mantiene `1,024.43 kB` minificado / `304.29 kB` gzip.

El paquete cerró todos los gates locales disponibles sin infraestructura. La activación en un VPS
sigue bloqueada hasta contratarlo, definir el dominio HTTPS y autorizar la configuración remota de
la URL de redirección en Supabase staging.
