# Handoff: fundación frontend → persistencia de Clientes

Fecha: 2026-08-17  
Estado: cerrado y supersedido por `2026-08-18-supabase-first-ready.md`.

## Objetivo del relevo

Continuar desde el prototipo verificable de Clientes hacia un corte vertical autenticado, sin ampliar todavía el dominio clínico. El resultado esperado del siguiente corte es: iniciar sesión, listar clientes autorizados y crear un cliente sintético mediante React → NestJS → Supabase con RLS.

## Reglas que hereda cualquier agente

1. Todo el trabajo y los artefactos permanecen dentro de `C:\Users\Moonlabpc\Desktop\aba 2`.
2. No acceder a otras carpetas sin permiso explícito para la ruta y la acción exactas.
3. No borrar archivos, carpetas, filas, recursos ni datos. Para pruebas usar estados archivados o identificadores únicos.
4. No conectar producción, credenciales reales ni datos clínicos/reales.
5. Aplicar spec-driven development y TDD: spec aprobada → prueba roja → implementación mínima → refactor → verificación.
6. Mantener separadas y sincronizadas las specs de frontend, backend, Supabase y publicación.
7. Usar shadcn/ui como base visual y solamente fixtures anonimizados.

La autoridad completa está en `AGENTS.md`.

## Entregado

- Mapeo forense del video por capturas y catálogo de pantallas.
- Flujo observado, hipótesis y preguntas abiertas.
- Skills locales para mapear capturas y flujos.
- Frontend React 19 + Vite + Tailwind + shadcn/ui en `apps/web`.
- Rutas `/clientes` y `/clientes/nuevo`.
- Tema claro alineado con la evidencia visual.
- Pruebas unitarias y de componentes.

## Verificación del punto de partida

| Control | Último resultado |
| --- | --- |
| Vitest | 3 archivos, 7 pruebas aprobadas |
| TypeScript | aprobado |
| ESLint | aprobado |
| Build Vite | aprobado |
| QA visual local | listado y alta aprobados |

Comandos desde `apps/web`, usando los binarios instalados localmente:

```powershell
.\node_modules\.bin\vitest.CMD run
.\node_modules\.bin\tsc.CMD -b
.\node_modules\.bin\eslint.CMD .
.\node_modules\.bin\vite.CMD build
```

## Contratos y documentos de referencia

- `specs/client-slice.md`: alcance implementado.
- `specs/frontend.md`: contrato visual y técnico del frontend.
- `specs/backend.md`: API NestJS propuesta.
- `specs/supabase.md`: modelo, RLS y migraciones propuestas.
- `specs/web-publication.md`: publicación de staging.
- `docs/system-rebuild/screen-catalog.md`: inventario visual.
- `docs/system-rebuild/screen-flow.md`: navegación reconstruida.
- `docs/system-rebuild/open-questions.md`: decisiones todavía no confirmadas.

## Límites actuales

- No existe `apps/api`.
- No existe proyecto Supabase conectado.
- No hay autenticación ni persistencia.
- El formulario no guarda datos.
- Informes permanece como navegación deshabilitada.
- No se ha autorizado ninguna publicación.

## Siguiente movimiento

Completado: P-01 a P-06 fueron aprobadas el 2026-08-17. El relevo continúa en `2026-08-17-slice-02-supabase-ready.md`.

## Definition of ready para implementar Slice 02

- Decisiones P-01 a P-06 aprobadas y registradas. Cumplido.
- Contrato compartido de Cliente aceptado.
- Proyecto Supabase de desarrollo/staging autorizado o estrategia local aprobada.
- Orígenes de frontend/API acordados para CORS.
- Ningún secreto almacenado en archivos versionados.
