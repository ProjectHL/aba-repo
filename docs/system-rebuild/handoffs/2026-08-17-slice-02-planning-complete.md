# Handoff global: planificación de Slice 02 completa

Fecha: 2026-08-17  
Estado: supersedido el 2026-08-18 por la decisión Supabase-first sin NestJS.

## Resultado planificado

```text
Login Supabase → Clientes React → Data API/RPC → PostgreSQL/RLS → detalle → smoke staging
```

## Specs cerradas

| Área | Spec | Estado de ejecución |
| --- | --- | --- |
| Supabase | `specs/slice-02/supabase.md` | siguiente unidad TDD local |
| Backend | `specs/growth/nestjs-api.md` | diferido a crecimiento |
| Frontend | `specs/slice-02/frontend.md` | espera tipos/RLS y Auth autorizada |
| Publicación | `specs/slice-02/web-publication.md` | espera cinco gates y aprobación |

## Decisiones de publicación

- Frontend candidato a Sites privado; no se ha creado `.openai/hosting.json`.
- No existe runtime API en Slice 02; NestJS queda planificado para crecimiento.
- Supabase staging será independiente de cualquier futura producción.
- La barrera privada del hosting no sustituye Supabase Auth ni RLS.
- No usar D1/R2 para duplicar datos clínicos; Supabase permanece como autoridad.

## Orden real de implementación

1. Supabase local: pruebas RLS, migración, grants, tipos y advisors.
2. Frontend: sesión, login, repositorio Supabase y estados de Clientes.
3. Publicación: aprobar infraestructura y pasar G-01 a G-05.
5. Smoke test con dos organizaciones y evidencia dentro del workspace.

## Autorizaciones aún necesarias

- Descargar/usar CLI o contenedores si no están disponibles dentro del workspace.
- Conectar o crear un proyecto Supabase staging.
- Crear el proyecto de hosting y publicar Sites privado.
- Configurar clave publicable, dominio y URLs Auth reales.

## Regla de verdad

“Spec lista” no significa “implementado”. Ninguna capa se marca completa hasta que sus pruebas y evidencia estén ejecutadas. No se permite borrar archivos, despliegues, proyectos, fixtures o registros.

## Próximo inicio recomendado

Volver al handoff `2026-08-17-slice-02-supabase-ready.md` y comenzar la primera prueba roja local. La siguiente spec funcional posterior a Slice 02 será Slice 03: ficha ampliada del cliente, familia, escolarización e historia clínica, pero no debe adelantarse a la vertical autenticada.
