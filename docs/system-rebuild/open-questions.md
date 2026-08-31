# Preguntas abiertas

## Resueltas para Slice 02 — 2026-08-17

- El ID clínico es único dentro de la organización, no globalmente.
- Roles iniciales: `admin`, `clinician` y `viewer`.
- `admin` y `clinician` pueden crear; `viewer` sólo consulta.
- Iniciales, ID clínico, idioma y fecha de nacimiento son obligatorios.
- El guardado es explícito y cancelar vuelve al listado sin persistir.
- El alta exitosa navega al detalle placeholder del cliente.

Las preguntas equivalentes que permanecen abajo se conservan como registro histórico; estas respuestas prevalecen para Slice 02.

## Prioridad alta antes de persistencia

1. ¿El ID del cliente debe ser único globalmente o sólo dentro de una organización?
2. ¿Qué roles existen y quién puede crear, editar, iniciar sesiones, exportar o asignar usuarios?
3. ¿El acceso se otorga por cliente, por organización o mediante ambos mecanismos?
4. ¿Qué significa exactamente el estado de consentimiento y qué bloquea cuando no está activo?
5. ¿Qué datos del alta son obligatorios?
6. ¿Qué requisitos legales, región y periodo de retención aplican a datos de menores/salud?

## Primer slice de Clientes

7. ¿La alta debe ser modal como en el video o ruta independiente que conserve la apariencia de diálogo?
8. ¿Se incluye toda la historia clínica en el alta inicial o se edita después desde la ficha?
9. ¿Los campos de convivencia, adaptaciones y escolarización son texto libre?
10. ¿El formato de fecha de la interfaz será local español, aunque el almacenamiento use ISO?
11. ¿La edad muestra años y meses y qué ocurre con fechas futuras o incompletas?

## Módulos posteriores

12. ¿Qué dimensiones de medición están soportadas además de frecuencia, porcentaje y duración?
13. ¿Cómo se relacionan funciones, conductas objetivo y programas de intervención?
14. ¿Cómo se inicia, pausa, reanuda, corrige y cierra una sesión?
15. ¿Qué formatos de exportación son requeridos: DOCX, PDF, JPG u otros?
16. ¿Los adjuntos admiten versiones y cuáles son sus límites/tipos?
17. ¿Los informes se generan bajo demanda o se almacenan?

## Slice 03 — cumplimiento clínico Chile

18. ¿Cuál es la razón social/RUT del responsable del tratamiento y quién es el prestador custodio de la ficha?
19. ¿ABA Data Hub será la ficha clínica oficial o sólo un sistema administrativo/interoperable?
20. ¿Qué módulos y campos son necesarios para cada finalidad asistencial?
21. ¿Cuál es la base de licitud y texto de información/consentimiento para cada finalidad?
22. ¿Cómo se verifica representación, cuidado personal y autonomía progresiva de menores?
23. ¿Qué profesionales están directamente relacionados con cada paciente y cuándo vence esa relación?
24. ¿Qué mecanismo jurídico aprobará la transferencia de datos a Brasil y otros subencargados?
25. ¿Qué plazos aplican a cuentas, consentimientos, auditoría, soporte, exportaciones y backups además de los 15 años de ficha clínica?
26. ¿Quién recibe y responde solicitudes de titulares e incidentes?
27. ¿Qué estándares MINSAL de certificación e interoperabilidad debe cumplir el producto?
