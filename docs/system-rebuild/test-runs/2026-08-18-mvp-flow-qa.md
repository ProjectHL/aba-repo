# QA independiente de flujos del MVP

Fecha: 2026-08-18  
Alcance: frontend local, artefacto candidato y Site privado publicado.  
Datos: exclusivamente identidades y valores sintéticos; no se utilizaron datos clínicos.  
Decisión al cierre de esta pasada: **NO-GO para entregar el Site publicado; candidato corregido apto para despliegue y retest**.

## Resumen ejecutivo

El código fuente y el candidato construido con modo `staging` pasan la regresión disponible. Sin embargo, la versión publicada en `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site/` muestra una pantalla vacía porque su bundle no contiene la configuración pública de Supabase staging. Esto bloquea login, listado, alta, detalle y logout para cualquier evaluador.

Existe un candidato corregido en `apps/web/verification/mvp-final-staging-20260818`. Se probó localmente sin modificarlo: renderiza el login, protege rutas privadas, maneja credenciales inválidas sin enumeración, conserva las barreras de datos sintéticos y responde correctamente en 390 px. El preflight actualizado también rechaza el artefacto defectuoso y aprueba el candidato corregido.

## Cobertura ejecutada

| Control | Resultado | Evidencia |
| --- | --- | --- |
| Vitest | PASS | 12 archivos, 41/41 pruebas |
| ESLint | PASS | cero errores |
| TypeScript | PASS | `tsc --noEmit` |
| Preflight candidato staging | PASS | 13 archivos inspeccionados |
| Preflight del artefacto publicado/v8 | FAIL esperado | falta configuración pública staging |
| Site publicado | FAIL | documento y JS cargan, pero `#root` queda vacío |
| Login candidato | PASS parcial | pantalla, etiquetas y submit visibles |
| Credenciales inválidas | PASS | mensaje genérico `Credenciales no válidas`, `role=alert` y foco en el alerta |
| Guard de detalle sin sesión | PASS | `/clients/{uuid}` redirige a `/login` |
| Responsive login | PASS | viewport 390 × 844, sin overflow horizontal |
| Accesibilidad básica | PASS parcial | `lang=es`, un `main`, un `h1`, labels asociados, `noindex` |
| Listado, alta, detalle y logout publicados | BLOQUEADO | el P0 impide llegar al login |
| Listado, alta, detalle y logout con cuenta real de staging | NO EJECUTADO | no se dispuso de contraseña; no se solicitó ni registró ninguna credencial |

## Hallazgos

### MVP-QA-001 — P0 — Site publicado completamente inutilizable

**Resultado observado**

- URL: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site/`.
- Título del documento: `ABA Data Hub · Staging`.
- Asset principal observado: `/assets/index-BR6Z5CBl.js`.
- El DOM contiene `<div id="root"></div>`, pero React no monta contenido.
- La consola registra `Error: Configuración de Supabase inválida` desde el asset principal.
- El mismo hash está en los artefactos locales `qa-pre-psychologist-20260818-v3` y `sites-package-v8`, ambos sin la URL del proyecto Supabase incorporada.
- El preflight actualizado falla sobre `verification/sites-package-v8/dist` con: `El artefacto no contiene la configuración pública de Supabase staging; use --mode staging`.

**Reproducción**

1. Abrir la URL publicada en una sesión autorizada por Sites.
2. Esperar la carga completa.
3. Observar una página vacía.
4. Revisar la consola: aparece el error de configuración de Supabase.

**Impacto**

La profesional no puede ver el login ni ejecutar ninguna tarea del MVP. Es un bloqueo total del piloto.

**Recomendación**

Publicar únicamente el artefacto generado con `vite build --mode staging`, ejecutar obligatoriamente `verify-staging-build.mjs` sobre el directorio exacto que se empaquetará y comprobar después del despliegue que el hash servido corresponde al candidato aprobado. El candidato `mvp-final-staging-20260818` contiene la configuración pública esperada y aprobó el preflight.

### MVP-QA-002 — P1 — El fallo de arranque no tiene una salida visible

**Resultado observado**

Cuando falla la lectura de configuración durante el bootstrap, la aplicación sólo registra una excepción y deja `#root` vacío. No aparece un mensaje de indisponibilidad ni una acción segura para reintentar o contactar soporte.

**Impacto**

Un error futuro de configuración o despliegue vuelve a presentarse como una pantalla blanca, sin diagnóstico para la evaluadora.

**Recomendación**

Añadir en una futura spec un fallback de bootstrap que no exponga valores de configuración y muestre un mensaje como “El entorno de pruebas no está disponible”. Mantener el error técnico únicamente en telemetría autorizada y sin secretos.

### MVP-QA-003 — P2 — Bundle principal grande para el alcance del MVP

**Resultado observado**

`verification/mvp-final-staging-20260818/assets/index-Dv-RWmEo.js` pesa 688.587 bytes sin comprimir.

**Impacto**

Puede aumentar el tiempo hasta interacción en conexiones lentas o equipos antiguos, aunque no bloquea la prueba profesional acotada.

**Recomendación**

Medir carga real después de restablecer el Site y evaluar separación de rutas o carga diferida. No retrasar el retest funcional por esta mejora.

## Evidencia positiva del candidato corregido

- Renderiza el banner persistente: `Entorno de pruebas · No ingresar datos reales ni de pacientes antiguos · Datos exclusivamente sintéticos`.
- El login tiene campos `email` y `password` etiquetados y un botón submit.
- Una ruta privada directa redirige a `/login` sin mostrar contenido protegido.
- Un intento sintético inválido mantiene al usuario en `/login`, usa un error genérico y mueve el foco al alerta.
- En 390 px no existe overflow horizontal.
- El documento declara `lang="es"`, `noindex, nofollow`, un `main` y un `h1`.
- Las 41 pruebas cubren autenticación, invalidación de sesión, listado, filtros, estados vacíos/error, detalle, reintento, formulario, alta única, conflicto de ID, validación de fechas, bloqueo de identificadores directos y confirmación sintética.

## Privacidad y no-cache

- El candidato aprobó el gate estático de `Cache-Control: no-store`, CSP, HSTS, `X-Content-Type-Options` y `X-Robots-Tag`.
- El artefacto publicado coincide por hash con el paquete v8 cuyo gate alcanzó y superó las comprobaciones de headers antes de fallar por configuración de Supabase.
- La API de navegador usada en esta pasada no expuso headers de navegación, por lo que la comprobación directa de respuesta publicada debe repetirse en el smoke posterior al despliegue.
- No se leyeron cookies, almacenamiento local, contraseñas ni tokens. No se alteró Supabase ni Sites.

## Gate obligatorio después del despliegue

1. Confirmar que la URL publicada ya no sirve `index-BR6Z5CBl.js` y que el login es visible.
2. Repetir raíz, ruta directa de detalle y asset inexistente; comprobar estados 200/200/404.
3. Comprobar en la respuesta publicada `Cache-Control: no-store`, CSP, HSTS y `noindex`.
4. Con una cuenta sintética `clinician`, ejecutar login → listado → alta sintética → detalle → regreso → logout.
5. Confirmar que el alta se guarda una sola vez y que no se registra correo, contraseña, JWT ni payload clínico.
6. Probar sesión inválida y acceso sin membresía activa.
7. Mantener **NO-GO para datos reales, antiguos o seudonimizados**.

## Archivos y servicios modificados por QA

- Código: ninguno.
- Supabase: sin cambios.
- Sites: sin cambios.
- Archivo nuevo: este reporte.

## Remediación posterior por el agente principal

- Se añadió un gate que rechaza bundles sin la URL pública de Supabase staging.
- Se añadió `build:staging` para hacer explícito `vite build --mode staging`.
- Se incorporó un estado seguro de indisponibilidad ante fallos fatales de configuración; dos pruebas nuevas elevaron la regresión a 43/43.
- Candidato final: `apps/web/verification/mvp-final-staging-20260818-v3`.
- Paquete final para Sites: `apps/web/verification/sites-package-v11`.
- Preflight, Worker, typecheck y lint: PASS.
- El Site activo no fue modificado: permanece NO-GO hasta que el usuario autorice el redespliegue y se ejecute el retest autenticado.

## Retest posterior al despliegue autorizado

- Sites versión 7 desplegada correctamente desde el paquete v11.
- Login visible en la URL activa; `#root` monta la aplicación.
- Asset activo: `index-DYjMFH3Q.js`; el bundle defectuoso anterior ya no se sirve.
- Ruta privada directa sin sesión redirige a `/login`.
- Un intento con credenciales obviamente sintéticas e inválidas devuelve `Credenciales no válidas`, confirmando conexión con Supabase sin enumeración.
- Cero errores recientes del Worker.
- Acceso conservado en modo `custom`: propietario único, cero grupos y cero visitantes externos.

Decisión actualizada: **GO para preparación del piloto exclusivamente sintético; NO-GO para datos reales**. El recorrido autenticado completo con cuenta profesional continúa como gate de onboarding de Slice 05.
