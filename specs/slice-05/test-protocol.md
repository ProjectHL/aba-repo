# Slice 05 / Protocolo de prueba profesional sintética

## Objetivo

Evaluar si una psicóloga comprende el sistema y completa el recorrido principal sin capacitación técnica, usando un caso completamente inventado.

Duración objetivo: 30–45 minutos.  
Modalidad: observación moderada, sin grabación por defecto.

## Preparación

- Enviar URL, invitación Sites y credencial Supabase por canales separados.
- Entregar la regla: “No uses pacientes actuales, antiguos, seudonimizados ni casos reconocibles”.
- Preparar un caso ficticio con código `SYN-PILOT-01`, iniciales artificiales y fechas inventadas.
- Pedir que piense en voz alta sin mencionar pacientes reales.
- Si comienza a introducir un caso real, detener inmediatamente la tarea y descartar el valor antes de enviar.

## Guion

1. Abrir el enlace e iniciar sesión.
2. Explicar qué cree que representa la pantalla de Clientes.
3. Encontrar un cliente sintético existente.
4. Abrir su detalle y volver al listado.
5. Crear `SYN-PILOT-01` con un tutor y un hermano ficticios.
6. Corregir deliberadamente una fecha inválida.
7. Agregar y retirar un familiar accidental.
8. Confirmar datos sintéticos y guardar una sola vez.
9. Cerrar sesión.

## Métricas

| Métrica | Registro |
| --- | --- |
| éxito por tarea | completo / con ayuda / no completo |
| tiempo | aproximado, sin grabar contenido |
| errores | cantidad y punto del flujo |
| facilidad percibida | escala 1–7 después de alta y detalle |
| confianza | escala 1–7 al terminar |
| severidad del hallazgo | P0–P3 según agente QA |

## Preguntas finales

1. ¿Qué parte fue más clara?
2. ¿Dónde dudaste o esperabas otra cosa?
3. ¿Qué información falta para que el flujo tenga sentido profesional?
4. ¿Qué elemento eliminarías o renombrarías?
5. ¿Confiarías en repetir este flujo con otro caso ficticio? ¿Por qué?

## Evidencia permitida

- tiempos, resultado de tarea, severidad y comentario parafraseado;
- identificadores `SYN-*` y `test_run_id`;
- captura sólo si no contiene correo, credenciales ni campos reconocibles.

## Evidencia prohibida

- nombres, RUT, correos de pacientes, diagnósticos, relatos clínicos;
- contraseña, JWT, claves o enlaces con tokens;
- audio/video de la profesional sin consentimiento y política aprobada.

## Cierre

- Archivar los Clientes sintéticos de la corrida.
- Inactivar la membresía si no habrá una segunda sesión inmediata.
- Clasificar hallazgos y abrir Slice 06 de estabilización.
- Mantener NO-GO absoluto para datos reales.

