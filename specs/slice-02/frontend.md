# Slice 02 / Frontend: autenticación y Clientes persistentes

## Estado

Núcleo implementado y retesteado el 2026-08-18: Auth, guards, login, repositorio, listado, alta, detalle, banner persistente y E2E real contra Supabase staging con identidades sintéticas. La regresión prepsicóloga aprobó 41 pruebas. Pendiente únicamente generar y publicar una versión web nueva con autorización explícita.

## Objetivo

Conectar el frontend existente directamente con Supabase Auth, Data API y RPC, conservando el lenguaje visual reconstruido y shadcn/ui como base.

## Rutas

| Ruta | Acceso | Estado requerido |
| --- | --- | --- |
| `/login` | público | formulario, cargando, error genérico |
| `/clientes` | autenticado | cargando, vacío, datos, error |
| `/clientes/nuevo` | autenticado con permiso | formulario, envío, error recuperable |
| `/clientes/:id` | autenticado | cargando, detalle, no encontrado, error y reintento |

### Composición de rutas

```text
BrowserRouter
├── PublicOnlyRoute
│   └── /login
└── ProtectedRoute
    └── AppShell
        ├── /clientes
        ├── /clientes/nuevo
        └── /clientes/:id
```

- Mantener el modo declarativo actual de React Router y rutas anidadas con `Outlet`.
- Preservar la URL solicitada al redirigir a login y volver a ella después de autenticar, únicamente si es una ruta interna permitida.
- Un usuario autenticado que visite `/login` vuelve a `/clientes`.
- Una ruta desconocida autenticada muestra un estado 404 local; no redirige silenciosamente.

## Máquina de sesión

| Estado | Interfaz | Transición |
| --- | --- | --- |
| `initializing` | shell de carga sin datos | sesión válida → authenticated; sin sesión → anonymous |
| `anonymous` | login | login correcto → authenticated |
| `authenticating` | login bloqueado y progreso | éxito o error recuperable |
| `authenticated` | rutas privadas | sign-out/401 → anonymous |
| `signingOut` | controles bloqueados | finaliza en anonymous aunque falle limpieza remota |

- Inicializar el cliente una sola vez y suscribirse a cambios de autenticación.
- Usar `getClaims` para comprobar identidad; supabase-js gestiona el token usado por Data API/RPC.
- No almacenar manualmente access o refresh tokens en estado persistente adicional.
- Desuscribir el listener al desmontar el provider y evitar actualizaciones duplicadas bajo React Strict Mode.

## Contratos de interfaz

- Usar clave publicable de Supabase; nunca clave secreta o `service_role`.
- Supabase-js gestiona la sesión y adjunta el JWT; no se persiste manualmente el token.
- Cualquier respuesta 2xx válida se considera éxito; no acoplarse a un único código para intercambios OAuth.
- Los errores de login no revelan si la cuenta existe.
- Un `401` limpia el estado de aplicación y vuelve a `/login`.
- Un `403` muestra falta de permiso sin redirigir en bucle.
- Un `409` en ID clínico conserva el formulario y marca el campo correspondiente.
- El botón de alta se deshabilita durante el envío para impedir duplicados.
- Todo alta de staging exige confirmación explícita de datos exclusivamente sintéticos y queda vinculada a un `test_run_id`.
- El formulario interrumpe RUT completos o correos en campos libres; es una barrera preventiva, no anonimización automática. La detección no puede rechazar un ID clínico sintético válido sólo porque contenga un subsegmento numérico parecido a un RUT.
- Traducir errores PostgREST/RPC a un `DomainError` propiedad del frontend; nunca presentar mensajes SQL crudos.
- Tratar `CLIENT_NOT_FOUND` de forma idéntica para recursos inexistentes o no autorizados.

### Login

- Campos: correo y contraseña; ambos requeridos y asociados a etiquetas.
- Usar `signInWithPassword`; mostrar “Credenciales no válidas” para cualquier fallo de credenciales.
- No incluir registro, recuperación, OAuth o MFA en Slice 02.
- No registrar correo, contraseña, respuesta Auth ni tokens.
- Enter envía el formulario; el foco pasa al resumen de error cuando corresponde.

### Adaptador Supabase

- `ClientsRepository` encapsula consultas Data API y la RPC `create_client`.
- AbortController cancela consultas al desmontar o reemplazar una búsqueda.
- Las respuestas se validan contra tipos generados de Supabase y esquemas de dominio.
- Timeout o red: `NETWORK_ERROR`; servicio no disponible: `SERVICE_UNAVAILABLE`; respuesta inválida: `INVALID_DATA_RESPONSE`.
- Un único reintento se permite sólo para lectura idempotente; la RPC de creación nunca se reintenta automáticamente.

## Estados de Clientes

### Listado

| Estado | Resultado |
| --- | --- |
| cargando | skeleton sin mostrar cero como dato real |
| vacío | estado vacío existente |
| éxito | métricas y filas derivadas de la respuesta |
| error | alerta con reintento manual |
| sin permiso | mensaje 403 sin filtrar datos |

- La búsqueda inicial filtra sólo los resultados cargados por iniciales o ID clínico.
- Las métricas distinguen clientes activos del total autorizado y la lista visible conserva sólo activos.
- Cada fila activa es un enlace accesible al detalle.
- No guardar respuestas clínicas en `localStorage` o `sessionStorage`.

### Alta

- Migrar validación a un esquema compartido con React Hook Form y resolver Zod.
- Mostrar errores inline y resumen accesible.
- Rechazar fechas calendario imposibles y calcular fecha presente/edad con zona `America/Santiago`.
- Permitir retirar tutores o hermanos agregados accidentalmente.
- `Cancelar` navega a `/clientes` sin request.
- Durante submit: deshabilitar controles que mutan arrays y el botón principal.
- Cuando la RPC devuelve un cliente válido, navegar a `/clientes/:id` con `replace` para evitar repetir el alta al volver.
- En error, conservar valores y foco; nunca incluir el body en telemetría.

### Detalle placeholder

- Consultar `public.clients` mediante Data API, filtrando por `id` y confiando el aislamiento a RLS; mostrar sólo los campos aprobados.
- Cubrir cargando, éxito, `CLIENT_NOT_FOUND` y error recuperable.
- No agregar historia clínica ni acciones de edición en este corte.

## Componentes previstos

- `AuthProvider` y `ProtectedRoute`.
- Cliente Supabase encapsulado en `lib/supabase`.
- Cliente Supabase singleton y tipado encapsulado en `lib/supabase`.
- Adaptador `ClientsRepository`; la UI no importa Supabase directamente para datos de dominio.
- shadcn/ui: `Alert`, `Skeleton` y `Sonner` sólo cuando su pantalla/prueba los requiera.

## Estructura prevista

```text
src/
├── auth/                 # provider, guards y login
├── lib/supabase/         # cliente, Auth, DomainError y tipos generados
├── features/clients/     # páginas, repositorio y componentes
└── test/fixtures/        # datos exclusivamente sintéticos
```

- Los componentes reciben datos/acciones; no conocen detalles de JWT.
- El repositorio de Clientes es sustituible por un fake en pruebas.
- Variables de Vite permitidas: URL Supabase, clave publicable y entorno. Ninguna variable pública contiene secretos.
- `VITE_APP_ENV=staging` muestra una prohibición explícita de datos reales o pacientes antiguos con semántica de estado; otros valores no muestran el banner.

## TDD

1. AuthProvider inicializa una vez y libera la suscripción.
2. Usuario sin sesión es redirigido al login conservando una ruta interna segura.
3. Login fallido presenta error accesible y genérico sin distinguir cuentas.
4. Login correcto y usuario ya autenticado navegan al destino esperado.
5. `401` expulsa; `403` no produce bucle de login.
6. Listado cubre cargando, vacío, éxito, búsqueda y error con reintento.
7. Alta valida campos obligatorios, calendario estricto, fecha no futura y confirmación sintética; acepta `E2E-SABA03-20260831` y mantiene el rechazo de un RUT completo o correo.
8. Alta no permite doble envío ni reintenta POST automáticamente.
9. Error 409 se asocia a `clinicalId` sin perder valores.
10. Alta exitosa navega con replace a `/clientes/:id`.
11. Detalle cubre éxito y `CLIENT_NOT_FOUND` indistinguible.
12. Ninguna prueba, fixture, log o snapshot contiene datos reales o tokens.
13. Un conflicto remoto queda asociado mediante `aria-invalid` y `aria-describedby`.
14. Listado distingue total/activos y permite navegar al detalle.

## Orden de implementación

1. Congelar contratos y crear fakes de Auth/Data API/RPC.
2. Pruebas rojas del AuthProvider y guards.
3. Login accesible con shadcn/ui.
4. Adaptador Supabase y normalización de errores.
5. Repositorio de Clientes y listado por estados.
6. Formulario conectado y detalle placeholder.
7. E2E local con servidor simulado; luego E2E staging autorizado.
8. QA visual en viewport de escritorio y móvil.

## Fuera de alcance

- Registro público, invitaciones, recuperación de contraseña, OAuth y MFA.
- Persistencia offline o cache de datos clínicos en navegador.
- Edición, archivado, borrado, historia clínica e informes.
- Acceso a tablas de dominio fuera de `ClientsRepository` o sin RLS.

## Criterios de aceptación

- Navegación por teclado y nombres accesibles conservados.
- No hay secretos en el bundle de producción.
- Contrato frontend/tipos Supabase comprobado automáticamente.
- Unitarias, componentes, typecheck, lint y build aprobados.
- Cero tokens o datos sensibles en logs, snapshots y bundle.
- QA visual y accesible documentada dentro del workspace.
- Dependencias nuevas fijadas exactamente y lockfile actualizado.
