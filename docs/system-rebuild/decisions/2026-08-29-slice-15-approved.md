# Decisión — Slice 15 informes clínicos completos y PDF

Fecha: 2026-08-29  
Decisión del usuario: **“documentar y continuar”**

## Aprobación

Se aprueban D15-01 a D15-06 como un único contrato:

1. El catálogo queda compuesto por Progreso, Evaluación y Completo.
2. “Completo” incluye perfil mínimo, evaluación, programas/metas, planes de conducta y progreso;
   excluye historia frontend y adjuntos.
3. El rango filtra eventos fechados; programas, metas y planes muestran su estado vigente.
4. Una fuente requerida fallida o no soportada bloquea el PDF completo; no se rotula una salida
   parcial como completa.
5. El PDF se genera en el navegador, se descarga por acción manual y no se persiste ni audita.
6. Sólo se incluyen iniciales e ID clínico como identificación; se excluyen fecha de nacimiento,
   familiares, convivencia, notas, adjuntos, drafts, consentimiento, usuarios e IDs internos.

## Autorización de implementación

Se autoriza implementación local con datos exclusivamente sintéticos mediante
`aba-tdd-validation`. No se autorizan cambios de Supabase, datos reales, descarga de QA fuera del
workspace, publicación ni despliegue.

## Invariantes

- El contenido se compone desde puertos de lectura existentes.
- No hay interpretación clínica automática.
- HTML, impresión y PDF usan el mismo modelo minimizado.
- Una ampliación de persistencia, destinatarios, auditoría o campos requiere nueva aprobación.
