# Test run — sesión clínica atómica

Fecha: 2026-08-18  
Proyecto remoto: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Datos: exclusivamente sintéticos

## Alcance

- Captura de fecha y notas de sesión.
- Mediciones de planes de conducta.
- Ensayos correctos e incorrectos por meta de adquisición.
- Persistencia única mediante `create_clinical_session`.
- Contratos de estados entre frontend y esquema remoto.

## Ciclo TDD

1. La prueba de pantalla falló contra la simulación anterior codificada.
2. Se añadió repositorio tipado y una única llamada `createAtomic`.
3. Se conectó la pestaña Sesiones a metas, planes y sesiones reales del cliente.
4. Se corrigieron los estados de programas, metas y planes para coincidir con Supabase.
5. Se añadió regresión específica de estados y contrato SQL repetible.

## Resultados

| Gate | Resultado |
| --- | --- |
| Pruebas frontend | PASS — 73/73 |
| TypeScript | PASS |
| ESLint | PASS |
| Contrato SQL remoto | PASS |
| RPC `SECURITY INVOKER` | PASS |
| `PUBLIC` / `anon` sin `EXECUTE` | PASS |
| `authenticated` con `EXECUTE` | PASS |
| Payload vacío o malformado | rechazado con `22023` |
| Persistencia parcial ante error hijo | no observada; la transacción se revierte |

No se ejecutó `vite build`: el build reemplaza el contenido de `dist` y la regla del proyecto
prohíbe borrados. La verificación proporcional quedó cubierta por TypeScript, lint y pruebas.

## Hallazgo solucionado

El frontend aceptaba estados distintos a los constraints de staging. Una inserción válida en estado
`draft` podía persistir y luego presentarse como respuesta inválida. Los contratos ahora son:

- programas y metas: `draft | active | mastered | archived`;
- planes de conducta: `draft | active | resolved | archived`.

La regresión automatizada evita volver a cruzar `mastered` y `resolved` entre entidades.

## Advisors

- Seguridad: sólo permanece la advertencia de protección contra contraseñas filtradas, función de
  plan Pro; no fue causada por este lote.
- Rendimiento: índices aún sin uso en el staging casi vacío. Se conservan porque protegen claves
  foráneas y consultas previstas; no se eliminó ninguno.

## Decisión

GO para continuar construyendo informes con datos sintéticos. Aún no constituye el QA final del
piloto profesional ni autoriza datos clínicos reales.

