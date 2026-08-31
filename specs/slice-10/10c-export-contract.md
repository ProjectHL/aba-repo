# Slice 10C.1 — Contrato de exportación minimizada

## Estado

**Implementada y verificada localmente (2026-08-25).** Autoriza exclusivamente la descarga
efímera en JPG de una serie visible del gráfico de S-12. No autoriza archivos remotos, Storage,
PDF/DOCX/CSV, adjuntos ni cambios a `ABA_staging`. La verificación E2E autenticada queda dentro
del gate 10D.

## Problema respaldado por evidencia

El producto observado muestra tres salidas que actualmente no tienen contrato de datos:

| Origen | Salida observada | Evidencia | Estado actual |
| --- | --- | --- | --- |
| S-05–S-07 | Informe de evaluación | E-012 | vista imprimible local, sin archivo |
| S-10 | Programas y conductas | E-016 | sin exportación |
| S-12 | Gráfico JPG | E-019 | gráfico visible, sin exportación |
| S-13 | Informe completo | E-020 | vista imprimible local, sin archivo |

La evidencia confirma que hay exportaciones, pero no confirma su formato definitivo, destinatario,
retención ni permisos. No se debe inferir PDF, DOCX, JPG ni un servicio de generación desde la
existencia de un botón.

## Decisión aprobada del responsable

La única salida implementable de este corte queda definida así:

| Aspecto | Decisión |
| --- | --- |
| Origen | S-12, una serie de evolución por plan visible |
| Audiencia | profesional autenticado con acceso actual al expediente |
| Formato | JPG creado en memoria por el navegador y descargado localmente |
| Contenido | nombre de la serie, sus fechas/valores, período seleccionado, iniciales e ID clínico sintético; marca `datos sintéticos` |
| Excluido | fecha de nacimiento, tutores, notas libres, adjuntos, perfil completo, otros gráficos y cualquier dato de otra organización |
| Sin datos/error | no se ofrece descarga sin puntos; un fallo local comunica un error accesible y no crea artefacto remoto |
| Retención/auditoría | ninguna: el navegador no conserva metadatos ni se registra una descarga |

### Alcance futuro bloqueado

S-08, S-10 y S-13 continúan con impresión local. No implementar documento clínico descargable,
adjuntos ni artefactos guardados remotamente sin una nueva decisión explícita.

## Fronteras

| Frontera | Cambio en 10C.1 | Condición para cambio futuro |
| --- | --- | --- |
| Frontend | botón por serie S-12, generación local y pruebas de minimización | otro formato o contenido aprobado |
| Supabase | ninguno | Storage/tabla/RLS sólo si hay archivo remoto aprobado |
| Backend | ninguno | servicio sólo si el navegador no puede generar el formato aprobado |
| Publicación | ninguno | smoke específico tras implementar la salida aprobada |

## Criterios de aceptación

- La descarga contiene exclusivamente la serie visible y el contexto mínimo aprobado; nunca el
  perfil ni campos excluidos.
- El control tiene un nombre accesible, se deshabilita sin puntos y anuncia un fallo local sin
  exponer detalles técnicos.
- La primera prueba roja comprueba la minimización y el estado sin datos antes de código.
- No se agregan dependencias, endpoints, Storage, tablas, migraciones ni secretos.

## Stop condition

Detener y crear una nueva decisión de producto si se solicita otro formato, contenido clínico
adicional, almacenamiento, adjuntos, un destinatario no profesional o trazabilidad remota.
