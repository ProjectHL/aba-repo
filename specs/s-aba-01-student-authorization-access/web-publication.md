# S-ABA-01 / Publicación web

Estado: **versión 13 publicada en Site staging privado; acceso autenticado bloqueado por error 500 de OpenAI Auth**

La versión 12 se conserva como evidencia histórica de un candidato inválido: el Worker dependía
de un binding de assets no operativo y devolvía 404. La versión 13 reemplaza ese candidato con un
Worker autocontenido y supera el preflight local de publicación. El gate funcional autenticado no
se declara verde hasta repetir el smoke después de recuperar el acceso.

## Principio

Publicar una interfaz no demuestra autorización. Sites controla audiencia del entorno; Supabase o
la futura frontera de dominio controla datos. Ambos controles son acumulativos y no se sustituyen.

## Gates de candidato

1. D01–D09 aprobadas y las cuatro capas marcadas listas.
2. Pruebas unitarias, BDD y RLS negativas verdes con fixtures sintéticos.
3. Deep links, refresh y caché no revelan estudiantes no asignados.
4. Bundle y HTML inicial no contienen datos clínicos, grants, roles de otros usuarios ni fixtures
   sensibles.
5. La vista familiar, si aún depende de S-ABA-02, permanece inaccesible y no se simula ocultando la
   UI profesional.
6. Smoke autenticado con cuatro identidades sintéticas separadas y un estudiante sintético.
7. Evidencia de revocación con sesión activa y sin borrar registros.
8. Cero P0/P1 abiertos; riesgos P2 documentados.
9. Mientras Sites no demuestre un binding de assets operativo, el Worker publicado debe ser
   autocontenido y el preflight debe verificar el bundle esperado en respuestas raíz y deep link.

## Matriz mínima de smoke privado

| Identidad sintética | Evidencia mínima |
| --- | --- |
| supervisor | ve estudiante, decide solicitud y revoca grant |
| coordinador | ve base, solicita, edita sólo tras aprobación |
| terapeuta | captura/envía; no configura ni edita programa |
| familia | sólo proyección aprobada o bloqueo explícito |
| miembro no asignado | 404 equivalente, sin inferencia |

## Límites

- No usar pacientes, familiares ni correos reales.
- No cambiar audiencia, Auth, Redirect URLs, Supabase ni Sites por aprobar esta spec.
- No enviar correos ni mensajes; notificación es sólo estado in-app en este slice.
- La descarga profesional debe probarse con contenido sintético minimizado. Descarga familiar sigue
  denegada por la propuesta D07.
- Cualquier despliegue requiere autorización separada después de un candidato local verde.

## Gate de salida

El slice puede considerarse publicable sólo tras aprobación técnica de la migración/RLS, QA
autenticado completo y autorización explícita de despliegue. La aprobación documental no cambia el
Site actual.
