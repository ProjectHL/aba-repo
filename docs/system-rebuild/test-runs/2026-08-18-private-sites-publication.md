# Test run: publicación privada Sites

Fecha: 2026-08-18  
Alcance: publicación owner-only del candidato QA, sin agregar evaluadores.  
Datos: exclusivamente sintéticos.  
Resultado: **aprobado**.

## Candidato

- Fuente publicada: commit `717b814c7f2c191c55a62ddaa33c1727012bb1a7`.
- Versión Sites activa: 6.
- URL: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`.
- Acceso: `custom`, un propietario, cero visitantes externos y cero grupos.
- Artefacto oficial: Worker autocontenido generado desde el build QA y empaquetado con el helper oficial de Sites.

## Regresión previa

| Verificación | Resultado |
| --- | --- |
| Vitest | 41/41 aprobadas |
| TypeScript build mode | aprobado |
| ESLint | aprobado |
| Worker autocontenido local | raíz, asset, SPA, 404 y headers aprobados |
| Build Vite | candidato v3 aprobado |

## Smoke en vivo

| Caso | Resultado |
| --- | --- |
| `/` | 200 |
| `/clientes/:id` directo | 200 con raíz de aplicación |
| asset versionado referenciado | 200 |
| asset inexistente | 404 esperado |
| `Cache-Control` | `no-store` |
| `X-Robots-Tag` | `noindex, nofollow` |
| CSP | presente |
| HSTS | presente |
| metadato noindex | presente |
| logs posteriores | sin fallos inesperados; sólo el 404 negativo deliberado |

## Incidentes resueltos

1. La reconstrucción limpia inicial reveló errores que `tsc --noEmit` no detectaba; se corrigieron y se añadió verificación con `tsc -b`.
2. Las versiones 3 a 5 ejecutaban el Worker, pero el binding `ASSETS` llegaba vacío y respondía 404.
3. El empaquetador oficial reprodujo el mismo problema, descartando un error de estructura manual.
4. Se generó un Worker autocontenido de 10 archivos, verificado localmente y publicado como versión 6.

No se borró ninguna versión, archivo, fila, usuario ni recurso. Los intentos anteriores permanecen como evidencia histórica.

## Gate

La infraestructura está lista para incorporar una evaluadora sintética. Antes de compartir acceso todavía se requiere:

1. correo exacto aprobado de la psicóloga;
2. agregar sólo ese correo a la allowlist privada;
3. asignar una identidad Supabase sintética individual;
4. entregar regla escrita y guion de prueba sin pacientes reconocibles.

