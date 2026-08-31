# Handoff de continuidad — siguiente spec 10C.1 (2026-08-24)

## Punto de continuación

El cierre visual del frontend terminó con 13/13 pantallas representadas y 92 pruebas locales
aprobadas. La siguiente spec activa es
[`specs/slice-10/10c-export-contract.md`](../../../specs/slice-10/10c-export-contract.md).

No inicia desarrollo de una descarga. Primero pide una decisión de producto que la evidencia no
resuelve: audiencia, formato, contenido permitido, período, adjuntos y retención para S-08, S-10,
S-12 y S-13.

## Estado exacto para quien continúe

| Área | Verificado | Pendiente / no inferir |
| --- | --- | --- |
| Frontend | S-08 y S-13 son rutas protegidas imprimibles; S-12 muestra series derivadas | archivo PDF/DOCX/JPG/CSV y descarga real |
| Supabase | registros base bajo RLS y RPC de sesión | Storage, metadatos, políticas, retención y auditoría |
| Backend | no existe servicio privilegiado, por decisión | API de generación sólo si el formato aprobado no puede ser local |
| QA | 92 tests, typecheck y lint aprobados | E2E autenticado posterior al fix 10A; no había sesión de navegador |

## Pregunta que desbloquea 10C.1

Para cada salida, confirmar: **quién la recibe, qué formato debe tener y qué campos puede incluir**.
La opción inicial de menor riesgo es un JPG local de S-12 o mantener impresión local; un documento
clínico descargable o adjuntos requiere un contrato de datos y autorización adicional.

## Primeros pasos después de la decisión

1. Actualizar en el mismo cambio las specs frontend, Supabase, backend y publicación.
2. Escribir una prueba roja de minimización y de error/sin datos para la única salida aprobada.
3. Implementar sin `service_role` y sin exponer campos excluidos.
4. Ejecutar prueba focalizada, suite, typecheck y lint; realizar E2E sólo con datos sintéticos.

## Brújula

| Eje | Estado |
| --- | --- |
| Pantallas | 13/13 frontend |
| Persistencia clínica E2E | 1 flujo vertical verificado antes de 10A/10B |
| Exportación descargable | 0; sólo impresión local |
| Calidad local | 92 pruebas + typecheck + lint |
| Próximo gate | decisión explícita de 10C.1 o retest autenticado de 10A |

No se alteraron archivos remotos, datos de staging ni configuraciones de publicación al producir
este handoff.
