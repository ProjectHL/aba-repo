# Retest privado staging v13 — S-ABA-01 + S-ABA-02

Fecha: 2026-08-31  
Site: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`  
Datos permitidos: exclusivamente sintéticos

## Resultado ejecutivo

La versión 13 permanece desplegada con acceso privado. El artefacto autocontenido fue revalidado
localmente, pero el smoke autenticado no pudo llegar a la aplicación: la selección de la cuenta en
OpenAI Auth devolvió `Server error 500` en dos intentos. El gate de UI autenticada continúa
pendiente y no se atribuye este bloqueo a S-ABA-01/02.

## Evidencia de publicación corregida

| Control | Resultado |
| --- | --- |
| Corrección de empaquetado | commit `1c5e582b7f8228f7696491f35d0ad6d2dd0a839c` |
| Worker | autocontenido; no depende de `env.ASSETS.fetch` |
| Preflight repetido | aprobado; 18 archivos inspeccionados |
| Archivo candidato | `apps/web/verification/s-aba-01-02-sites-v13-1c5e582.tar.gz` |
| Tamaño | 1,518,346 bytes |
| SHA-256 | `743641C526B6552538004E58DE4314292576B074977847F8A5A75B2C7CF6B08D` |
| Sites | versión 13; despliegue `succeeded`; audiencia privada preservada |

La versión 12 se conserva como evidencia del fallo previo: su Worker devolvía 404 en root y rutas
profundas por depender de un binding de assets no operativo. No se borraron versiones ni
artefactos.

## Secuencia visible del retest

1. La navegación directa a `/clientes` mostró correctamente la puerta privada de staging y la
   acción «Continuar con ChatGPT».
2. OpenAI Auth mostró el selector de cuenta para «ABA Data Hub · Staging».
3. Tras la autorización explícita de la persona usuaria, se seleccionó la cuenta existente.
4. OpenAI Auth respondió `Server error 500`.
5. Se utilizó una vez «Volver a intentar» y se repitió la selección autorizada; el mismo error 500
   volvió a aparecer.

No se alcanzó el bundle de la aplicación autenticada, por lo que no se verificaron visualmente el
marcador «Consentimiento por finalidad», las tarjetas de acceso, las rutas profundas internas ni
la persistencia remota desde esta sesión.

## Clasificación

- P0/P1 de S-ABA-01/02: ninguno nuevo reproducido.
- Bloqueo externo provisional: OpenAI Auth 500 impide el smoke autenticado.
- Gate de UI autenticada: pendiente, no verde.
- Supabase durante publicación y retest: sin mutaciones.
- Registros: no se crearon, editaron ni eliminaron registros.

## Retest mínimo

Cuando OpenAI Auth permita completar la selección de cuenta:

1. entrar a `/clientes` y confirmar que carga el bundle v13;
2. recargar una ruta profunda autorizada y confirmar respuesta de la SPA;
3. inspeccionar, sólo en lectura, los estados sintéticos ya persistidos de S-ABA-01/02;
4. registrar cualquier brecha visible y cerrar el gate únicamente si no hay P0/P1.

