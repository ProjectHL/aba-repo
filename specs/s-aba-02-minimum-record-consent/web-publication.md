# S-ABA-02 / Publicación web

Estado: **versión 13 publicada en Site staging privado; acceso autenticado bloqueado por error 500 de OpenAI Auth**

La versión 12 queda registrada como candidato fallido por 404 en root y deep links. La versión 13
usa el Worker autocontenido exigido por este gate y supera el preflight local; la UI autenticada de
consentimiento y expediente mínimo sigue pendiente de retest visible.

## Gates

1. D02-01–D02-09 aprobadas.
2. Revisión jurídica/técnica antes de cualquier dato real o afirmación de consentimiento válido.
3. BDD, contratos y pruebas RLS negativas verdes con fixtures sintéticos.
4. HTML, bundle, logs, URLs y analytics sin contenido del expediente ni referencias de evidencia.
5. Deep links/refresh respetan S-ABA-01 antes de renderizar.
6. No existe bucket, upload, firma ni enlace público de consentimiento.
7. Smoke privado con usuarios sintéticos y cero P0/P1.
8. El artefacto de Sites debe usar Worker autocontenido hasta que exista evidencia de un binding
   de assets operativo; una publicación que devuelve 404 en root/deep link no supera el gate.

## Límites

La aprobación documental no modifica el Site actual. Un candidato local y cualquier deploy
requieren autorizaciones separadas. Staging mantiene el banner de datos sintéticos y el estado de
consentimiento se etiqueta como demostrativo, no legal.
