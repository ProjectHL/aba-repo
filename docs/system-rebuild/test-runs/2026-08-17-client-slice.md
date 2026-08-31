# Verificación del corte: clientes

Fecha: 2026-08-17

## Alcance

- Ruta `/clientes` con resumen, búsqueda y estado vacío.
- Ruta `/clientes/nuevo` con información básica y convivencia.
- Navegación entre listado y alta.
- Tema claro fijo para mantener coherencia con la evidencia del video.
- Persistencia remota desactivada; se permiten únicamente datos sintéticos.

## Resultado automatizado

| Control | Resultado |
| --- | --- |
| Vitest | 3 archivos, 7 pruebas aprobadas |
| TypeScript | aprobado |
| ESLint | aprobado |
| Build de producción | aprobado |

## Verificación visual local

- Listado: aprobado en `http://127.0.0.1:5173/clientes`.
- Alta: aprobado en `http://127.0.0.1:5173/clientes/nuevo`.
- Se verificaron jerarquía, navegación, etiquetas accesibles, estado vacío y bloqueo nativo de campos obligatorios.

## Límites conocidos

- Sin autenticación.
- Sin guardado local o remoto.
- Sin API NestJS.
- Sin proyecto Supabase conectado.
- Los requisitos inferidos siguen sujetos a aprobación en `open-questions.md`.
