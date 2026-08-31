# Publicación privada staging — S-ABA-01 + S-ABA-02

Fecha: 2026-08-30  
Site: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`  
Datos permitidos: exclusivamente sintéticos

## Resultado

La versión 12 fue publicada correctamente en el Site staging existente. El acceso se conservó en
modo `custom`, con la cuenta propietaria como única identidad permitida, sin grupos ni visitantes
externos. No se cambió Supabase, Auth, Redirect URLs, audiencia, Storage, producción clínica ni VPS.

## Candidato publicado

| Gate | Evidencia |
| --- | --- |
| Fuente | commit `06e14033c5764a3722c3d74686e924147825e27b` |
| Vitest | 32 archivos, 139/139 pruebas verdes |
| TypeScript | verde |
| ESLint | verde |
| Build staging aislado | verde |
| Preflight | 17 archivos inspeccionados, aprobado |
| Worker | fallback SPA, 404 de assets y headers aprobados |
| Versión Sites | 12, despliegue `succeeded` |

El artefacto no contiene patrones de service role, claves secretas ni JWT literales. Conserva
`noindex, nofollow`, CSP, HSTS, `no-store` y configuración pública de Supabase staging.

## Pendiente

No se ejecutó todavía el smoke autenticado visible de las pantallas S-ABA-01/02. Para reutilizar la
sesión del navegador de la aplicación, las reglas del workspace exigen autorización explícita para
leer la skill externa de control del navegador. No se declara el gate de UI como verde hasta
completarlo.

Los registros sintéticos existentes permanecen en staging y no se eliminó ningún artefacto.

