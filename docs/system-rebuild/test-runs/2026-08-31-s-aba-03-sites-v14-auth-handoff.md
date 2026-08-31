# S-ABA-03 — publicación Sites v14 y pausa antes del E2E

Fecha: 2026-08-31  
Sitio: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`  
Datos: exclusivamente sintéticos; no se persistió ningún fixture en esta fase.

## Publicación verificada

| Gate | Evidencia | Estado |
| --- | --- | --- |
| Fuente | commit `8daed58` | verde |
| Regresión previa | 34 archivos, 147/147; tipos y lint verdes | verde |
| Build aislado | `s-aba-03-staging-20260831-r4` | verde |
| Worker | 14 assets autocontenidos | verde |
| Preflight | 18 archivos; staging URL pública de Supabase, sin secretos | verde |
| Sites | versión 14 desplegada | verde |
| Acceso | `custom`, una cuenta propietaria, cero grupos y cero visitantes externos | verde |
| Autenticación visible | ChatGPT → `/clientes` y banner de staging | verde |

El primer paquete intermedio conservó el Worker enlazado de Vite y fue rechazado por preflight. Se
creó un paquete nuevo `package-s-aba-03-staging-20260831-r5` sin sobrescribir ni borrar artefactos;
ese paquete autocontenido fue el único publicado.

## Punto exacto de pausa

La sesión autenticada abrió `/clientes/nuevo`. El formulario quedó preparado con un adulto
ficticio:

- iniciales: `UV`;
- identificador clínico: `E2E-SABA03-20260831`;
- nacimiento ficticio: `1990-05-14`;
- convivencia: `persona adulta independiente`;
- confirmación de datos exclusivamente sintéticos: marcada.

El botón `Continuar con datos sintéticos` está habilitado, pero no fue pulsado. No existe todavía
un `client_id` para este fixture y no debe afirmarse persistencia, RLS funcional ni BDD completado.

## Supabase y no borrado

Esta fase no ejecutó mutaciones Supabase. Las mutaciones previas de schema fueron 018/019 y están
documentadas en `2026-08-31-s-aba-03-staging-schema.md`. No se borró, movió, truncó ni archivó nada.

## Retest mínimo

1. Reanudar o reabrir el sitio versión 14 y confirmar sesión autenticada/banner staging.
2. Obtener confirmación puntual antes de enviar el formulario preparado.
3. Completar BDD-03-01–BDD-03-12 mediante UI, usando sólo fixtures sintéticos persistentes.
4. Verificar persistencia/RLS con consultas acotadas de sólo lectura y documentar defectos.
5. No eliminar los fixtures al terminar.
