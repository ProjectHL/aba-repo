# QA de consolidación del avance

Fecha: 2026-08-18  
Entorno: frontend local en modo staging + `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Datos: exclusivamente sintéticos; no se crearon registros persistentes

## Alcance

- Regresión unitaria y de componentes.
- TypeScript y ESLint.
- Login, registro, errores genéricos, responsive móvil y guard de rutas en navegador.
- Contratos de programas, metas y planes de conducta mediante pruebas focalizadas.
- RLS, grants y advisors de Supabase.
- Revisión de secretos y encabezados de privacidad.

## Resultado

| Gate | Resultado |
| --- | --- |
| Vitest | 13 archivos, 59/59 pruebas PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Login staging | Render correcto; error inválido genérico y enfocado |
| Registro | Doble contraseña, mínimo y discrepancia validados |
| Responsive 390 × 844 | PASS; sin desborde horizontal observado |
| Guard privado | `/clientes` redirige a `/login` sin sesión |
| Consola | Sin errores ni advertencias durante los recorridos |
| Supabase | 14/14 tablas públicas con RLS; `anon` sin SELECT |
| Privacidad web | `Cache-Control: no-store`, CSP, noindex y frame deny presentes |

## Hallazgos y resolución

### QA-01 — servidor local sin configuración staging — RESUELTO

- Severidad: P1 de desarrollo.
- Evidencia: Vite sin modo mostraba `El entorno de pruebas no está disponible`.
- Causa: el script `dev` usaba `vite` sin `--mode staging`.
- Solución: `pnpm dev` ahora ejecuta `vite --mode staging`; se conserva `dev:bare` únicamente
  para probar el gate de configuración. README reemplazado por instrucciones del proyecto.
- Retest: login completo visible en `http://127.0.0.1:4180/login`.

### QA-02 — protección contra contraseñas filtradas — ABIERTO / DEPENDENCIA DE PLAN

- Severidad: P1 antes de datos reales; no bloquea staging sintético.
- Supabase Advisor mantiene `auth_leaked_password_protection`.
- La función requiere plan Pro. No existe una corrección gratuita equivalente en el dashboard.
- Mitigación vigente: mínimo frontend de 12 caracteres, acceso pendiente de aprobación y datos
  exclusivamente sintéticos.

### QA-03 — índices todavía sin uso — ACEPTADO

- Severidad: informativa.
- Advisor reporta índices nuevos sin uso porque staging aún no tiene carga de trabajo clínica.
- No se eliminan: cubren claves foráneas y consultas previstas; la regla del proyecto prohíbe borrar.
- Revisar métricas después de una ventana real de pruebas sintéticas.

### QA-04 — recorrido autenticado completo del lote 03 — DIFERIDO

- Severidad: P1 de publicación.
- No se reutilizaron ni registraron contraseñas, tokens o almacenamiento del navegador.
- Cobertura actual: pruebas focalizadas verifican alta de meta y plan; Supabase confirma RLS y grants.
- Gate pendiente: login con credencial de QA disponible durante el QA final y recorrido navegador de
  cliente → programa → meta → plan → recarga.

## Decisión

**GO para continuar desarrollo. NO-GO todavía para datos reales.** El avance queda limpio para iniciar
la captura atómica de sesiones. La publicación de los lotes nuevos permanece pendiente.

