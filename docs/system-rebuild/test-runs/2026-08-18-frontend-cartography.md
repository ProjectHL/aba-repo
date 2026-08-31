# QA de cartografía frontend — Slice 08

Fecha: 2026-08-18  
Entorno: código local, build staging y Site privado  
Datos utilizados: exclusivamente valores sintéticos

## Resultado

**PASS para revisión visual del mapa; NO-GO para registrar información clínica.**

La entrega ya no se presenta como MVP clínico. Es una cartografía navegable que permite a la
profesional evaluar la organización de pantallas y formularios antes de implementar persistencia.

## Controles

| Control | Resultado |
| --- | --- |
| Vitest | PASS — 13 archivos, 56/56 pruebas |
| TypeScript build | PASS |
| ESLint | PASS |
| Vite staging | PASS |
| Preflight de seguridad | PASS — 14 archivos |
| Worker autocontenido | PASS — 10 archivos embebidos |
| Publicación privada | PASS — Sites versión 10 |
| Smoke de login publicado | PASS |
| Consola del navegador | PASS — cero errores |
| Recorrido autenticado manual | No ejecutado; no se transmitieron credenciales |

## Vistas verificadas por TDD

- Expediente con cinco tabs accesibles.
- Información general, contexto familiar e historia clínica.
- Evaluación: entrevista inicial, preferencias y evaluación funcional.
- Adquisición: metas y protocolo de enseñanza.
- Reducción: conductas objetivo y funciones/intervención.
- Sesiones: frecuencia y ensayos correctos/incorrectos en simulación local.
- Informes: gráficos, informe de evaluación e informe completo.

## Límites visibles y deliberados

- Los formularios clínicos no escriben en Supabase.
- La simulación de sesión se reinicia al recargar.
- Los informes no calculan, exportan ni consumen registros.
- No existen todavía historial de cambios, firma clínica ni auditoría por registro.
- El bundle principal pesa 718,75 kB sin comprimir; conviene dividir por rutas en una slice posterior.

## Publicación

- URL: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`
- Versión: 10
- Commit fuente: `32d59743f8f80e87ccc89d59038d963ebac38ec6`
- Acceso: publicación privada; no se modificó la política de acceso.
- Supabase: sin cambios de esquema ni datos en esta slice.

## Decisión QA

GO para que la psicóloga revise nombres, orden, comprensión y ergonomía usando únicamente datos
sintéticos. NO-GO para pacientes reales, antiguos o seudonimizados hasta implementar las slices
funcionales y sus controles legales/técnicos.
