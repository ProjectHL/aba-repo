# Handoff: piloto sintético privado en línea

Fecha: 2026-08-18  
Estado: **Site privado activo y verificado; evaluadora aún no invitada**.  
URL: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`

## Entregado

- Slice 04 separada en frontend, backend, Supabase y publicación.
- Frontend QA con 41 pruebas, build mode, lint y build aprobados.
- Versión Sites 6 desplegada con acceso owner-only.
- Worker autocontenido repetible para Vite, con generador y verificador versionados.
- Root, detalle directo, assets, 404, no-store, noindex, CSP y HSTS verificados en vivo.
- Supabase staging continúa como única persistencia, con RLS y auditoría ya aprobadas.

## Estado de acceso

- Propietarios: 1.
- Visitantes externos: 0.
- Grupos autorizados: 0.
- La psicóloga no tiene acceso todavía.
- No se generaron bypass tokens nuevos ni se compartieron credenciales administrativas.

## Siguiente acción

Recibir el correo exacto de la psicóloga y confirmación para:

1. agregarlo como único visitante externo;
2. crear o asignar su cuenta Supabase de staging con contraseña individual;
3. verificar login y rol sin copiar la contraseña a documentación;
4. entregar el guion de prueba exclusivamente sintético;
5. observar la sesión y documentar bugs sin capturar datos sensibles.

## Brújula

| Categoría | Avance | Estado |
| --- | ---: | --- |
| QA y regresión | 100% | verde |
| Frontend sintético | 100% | activo |
| Supabase staging | 100% | RLS/auditoría verificadas |
| Publicación privada | 100% | versión 6 en línea |
| Headers y rutas vivas | 100% | smoke aprobado |
| Onboarding de psicóloga | 35% | falta correo, allowlist y cuenta individual |
| Preparación total del piloto | 95% | falta habilitar evaluadora |
| Autorización de datos reales | 0% | gates C-01 a C-10 rojos |

Próximo norte: **incorporar una sola evaluadora con identidad individual y ejecutar el guion sintético**.
