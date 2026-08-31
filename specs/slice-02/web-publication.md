# Slice 02 / Publicación: staging sintético

## Estado

Preflight local, E2E Supabase y retest QA prepsicóloga completados. Site privado owner-only creado y versión 1 guardada, pero esa versión es anterior a las correcciones QA. Falta guardar/publicar una versión nueva con autorización explícita y verificar sus headers en la URL activa.

## Objetivo

Proveer una URL de pruebas no productiva para validar el recorrido autenticado de Clientes usando exclusivamente identidades y registros sintéticos. La política `docs/system-rebuild/policies/test-data-policy.md` prohíbe pacientes actuales o antiguos en este entorno.

## Topología propuesta

```text
Navegador
├── Frontend Vite en Sites privado
└── Supabase staging administrado: Auth, Data API, RPC y PostgreSQL/RLS
```

- Sites privado agrega una barrera de acceso al entorno; Supabase Auth continúa siendo la identidad de aplicación y RLS la autorización de datos.
- No asumir que el build Vite actual es compatible con Sites hasta ejecutar una prueba de empaquetado autorizada.
- Supabase de staging es un proyecto separado de cualquier futura producción.
- NestJS queda fuera de Slice 02 y planificado únicamente como crecimiento.

## Entornos

| Entorno | Datos | Acceso | Publicación |
| --- | --- | --- | --- |
| local | sintéticos | equipo local | permitida dentro del workspace |
| staging | sintéticos | usuarios de prueba autorizados | requiere aprobación |
| producción | fuera de alcance | ninguno | prohibida en Slice 02 |

## Matriz de configuración

### Frontend — valores públicos compilados

| Variable | Uso | Secreto |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | endpoint Auth de staging | no |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | clave publicable | no |
| `VITE_APP_ENV` | mostrar banner `staging` | no |

Todo valor `VITE_*` se considera visible en el bundle. La aplicación valida presencia y formato sin imprimir valores.

Slice 02 no necesita `service_role`, clave secreta, contraseña directa de base de datos ni runtime API propio para el flujo ordinario.

## Controles

- HTTPS y origen único aprobado.
- Sitio no indexable y banner persistente de entorno de prueba.
- Variables de frontend limitadas a valores públicos.
- No existen secretos Supabase en el bundle; la clave publicable trabaja junto con grants y RLS.
- Encabezados de seguridad y política de contenido ajustada a los servicios realmente usados.
- Sin analítica que capture formularios, URLs sensibles o contenido clínico.
- Logs con retención mínima acordada y sin payloads.
- El hosting debe redirigir rutas SPA como `/clientes/:id` a `index.html` sin convertir errores reales de assets en HTML.
- Configurar por entorno la URL Supabase y clave publicable; validar su presencia al arrancar sin imprimir valores.
- El smoke test debe confirmar que refresh directo en una ruta protegida conserva el guard y no expone contenido antes de resolver sesión.
- Supabase Auth registra la URL exacta de staging; no usar wildcard para el dominio estable.
- CSP limita `connect-src` al frontend y Supabase autorizados; además `frame-ancestors 'none'`, `object-src 'none'` y `base-uri 'self'`.
- Añadir `X-Content-Type-Options: nosniff`, una política de referrer restrictiva y HSTS en hosts HTTPS cuando el proveedor lo soporte.
- Respuestas HTML y rutas de aplicación usan `Cache-Control: no-store`; los assets versionados pueden usar una política separada.
- No indexar: encabezado `X-Robots-Tag: noindex, nofollow` y metadato equivalente.
- Un check automatizado inspecciona el bundle para nombres de variables prohibidas, tokens de fixtures y patrones de claves secretas.

### Preflight local aprobado para implementar sin despliegue

- Documento HTML en español, título inequívoco de staging, metadatos `noindex, nofollow` y `strict-origin-when-cross-origin`.
- Banner persistente condicionado por `VITE_APP_ENV=staging`.
- Build conservado en una ruta de verificación versionada; no vaciar ni reemplazar artefactos anteriores.
- Verificador local falla si el artefacto no contiene `noindex` o si detecta `service_role`, `sb_secret_` o un JWT literal.
- CSP, HSTS, `X-Robots-Tag` y fallback SPA se configuran únicamente al seleccionar y autorizar el proveedor de publicación.
- El preflight de hosting debe conservar `_headers`, `_redirects` y `404.html` en el artefacto. Las rutas SPA vuelven a `index.html`, pero `/assets/*` devuelve un 404 real.
- La integración de `@openai/sites-vite-plugin` permanece condicional hasta que Sites entregue un `project_id`; el build local no puede depender de un identificador inventado.
- Sites sirve el build mediante `dist/server/index.js`: el Worker consulta primero el binding estático `ASSETS`, conserva los `404` bajo `/assets/` y sólo aplica fallback a `index.html` para rutas SPA.
- El Worker aplica los headers de seguridad en runtime porque el soporte de `_headers` debe verificarse por proveedor y no se asume automáticamente.

## Gates de publicación

| Gate | Evidencia requerida |
| --- | --- |
| G-01 Supabase | migración, grants, RLS y advisors aprobados |
| G-02 Frontend | unitarias/componentes/E2E, accesibilidad y build verdes |
| G-03 Seguridad | secret scan, headers y errores verificados |
| G-04 Datos | dos organizaciones y usuarios exclusivamente sintéticos |
| G-05 Autorización | aprobación explícita para crear/publicar staging |

Si cualquier gate falla, no se publica.

### Estado de gates al 2026-08-18

| Gate | Estado | Observación |
| --- | --- | --- |
| G-01 Supabase | aprobado con limitación documentada | RLS/E2E verdes. Advisor sólo advierte que leaked-password protection requiere plan Pro; staging usa plan Free. |
| G-02 Frontend | aprobado localmente | 41 pruebas, typecheck, lint, build no destructivo y smoke HTTP verdes. |
| G-03 Seguridad | aprobado localmente | bundle sin secretos; Worker y preflight validan `no-store`, noindex, headers y fallback. Falta confirmación en URL publicada. |
| G-04 Datos | aprobado | dos organizaciones, tres identidades automatizadas, una identidad manual y fixtures exclusivamente sintéticos. |
| G-05 Autorización | pendiente | la versión 1 está obsoleta frente a las correcciones QA; no debe desplegarse. Se requiere autorización para guardar/publicar el nuevo candidato. |

## Pipeline

1. Construir el frontend una vez desde el lockfile fijado.
2. Ejecutar tests, typecheck, lint y análisis de secretos.
3. Verificar migración y RLS en entorno autorizado.
4. Configurar Supabase staging antes del frontend.
5. Configurar URL Auth exacta y variables públicas.
6. Crear/publicar Sites privado sólo después de G-05.
7. Ejecutar smoke test con identificador único y dos organizaciones.
8. Registrar evidencia sin borrar datos; marcarlos por `test_run_id` y `archived` cuando corresponda.
9. Conservar el último artefacto funcional para recuperación no destructiva.

## Smoke test

```text
abrir staging → ver banner → login sintético → listar → crear cliente sintético → ver detalle → cerrar sesión
```

### Casos obligatorios

1. Usuario clinician de organización A crea y consulta un cliente sintético.
2. Usuario viewer de A lista y consulta, pero recibe `403` al intentar crear.
3. Usuario de organización B no ve ni puede inferir el cliente de A.
4. Usuario sin sesión vuelve a login desde una ruta protegida.
5. Refresh directo en `/clientes/:id` conserva navegación y protección.
6. ID clínico duplicado dentro de A devuelve `409`; el mismo ID en B cumple P-01.
7. Ninguna respuesta, log o captura contiene contraseña, JWT o clave secreta.

## Observabilidad y evidencia

- Checks diferenciados para frontend y conexión funcional autorizada a Supabase.
- Métricas mínimas: disponibilidad, latencia, errores por código y correlation ID; nunca campos clínicos.
- Alertas y retención se definen antes de producción, no en Slice 02.
- Evidencia dentro de `docs/system-rebuild/test-runs/`: fecha, artefacto, URLs sin tokens, `test_run_id`, resultados y limitaciones.

## Recuperación no destructiva

- No borrar despliegues, proyectos o registros.
- Ante fallo, volver a servir el último artefacto aprobado o publicar una versión corregida.
- Marcar fixtures fallidos como archivados; nunca ejecutar `DELETE`.
- Documentar incidente y versión activa sin copiar secretos.

## Fuera de alcance

- Producción, dominio definitivo, SLA y datos reales.
- Acceso público, SEO, analítica de comportamiento y grabación de sesiones.
- Registro abierto, recuperación de contraseña, OAuth y MFA.
- D1/R2: Supabase sigue siendo la persistencia autoritativa; no duplicar datos clínicos en almacenamiento de Sites.

## Criterios de aceptación

- Ningún secreto aparece en el bundle o logs.
- Usuario de otra organización no observa el registro del smoke test.
- El entorno se identifica inequívocamente como staging.
- El resultado y sus identificadores quedan documentados dentro del workspace.
- Los cinco gates están aprobados y trazables.
- Login, permisos y aislamiento se verifican con dos organizaciones.
- Refresh de rutas SPA y headers de seguridad son correctos.
- Existe una ruta de recuperación no destructiva probada.
