# Test run: Sites versión 7 — MVP sintético

Fecha: 2026-08-18  
URL: `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`  
Acceso: privado `custom`, propietario único, cero grupos y cero visitantes externos.  
Datos: exclusivamente sintéticos.

## Publicación

- Paquete fuente: `apps/web/verification/sites-package-v11`.
- Artefacto previo: 43/43 tests, TypeScript, lint, preflight y Worker aprobados.
- Versión guardada en Sites: 7.
- Despliegue: `succeeded`.

## Smoke en vivo

| Control | Resultado |
| --- | --- |
| Login visible | PASS |
| Banner de datos exclusivamente sintéticos | PASS |
| Asset corregido `index-DYjMFH3Q.js` | PASS |
| Asset defectuoso anterior ausente | PASS |
| Ruta `/clientes/:id` sin sesión | redirige a `/login` |
| Credenciales sintéticas inválidas | error genérico, sin enumeración |
| Errores recientes del Worker | 0 |
| Acceso privado | propietario único |

## Decisión

**GO para onboarding y prueba profesional exclusivamente sintética.**  
**NO-GO para datos reales, históricos, reconocibles o seudonimizados.**

El siguiente gate requiere correo exacto de la psicóloga, rol `clinician`, creación de credencial individual, invitación privada y recorrido autenticado completo.
