# S-ABA-03 / BDD

Estado: **contratos locales y SQL staging verdes; BDD autenticado por UI pendiente**

| ID | Given | When | Then | Prioridad |
| --- | --- | --- | --- | --- |
| BDD-03-01 | supervisor y estudiante sintéticos | crea borrador de adquisición incompleto | se guarda como draft y no puede activarse | P1 |
| BDD-03-02 | borrador completo | activa | crea versión 1 active y evento de auditoría | P1 |
| BDD-03-03 | programa active | pausa y luego reactiva | conserva versión e historial; vuelve a active | P1 |
| BDD-03-04 | programa active | edita diseño | crea versión sucesora; la anterior no cambia | P0 |
| BDD-03-05 | programa active con sesiones históricas | crea sucesora | las sesiones siguen vinculadas al diseño original | P0 |
| BDD-03-06 | programa active | marca achieved | queda terminal y rechaza reactivación | P1 |
| BDD-03-07 | coordinador sin grant | intenta editar o transicionar | operación denegada por RLS; lectura según grant | P0 |
| BDD-03-08 | coordinador con `program:edit` vigente | crea sucesora | operación permitida y auditada | P0 |
| BDD-03-09 | terapeuta asignado | consulta y trata de editar | ve sólo lo autorizado; escritura denegada | P0 |
| BDD-03-10 | miembro no asignado | consulta ID conocido | 404 equivalente, sin inferencia | P0 |
| BDD-03-11 | programa de conducta sin plan de crisis | activa con resto válido | activación permitida y aviso informativo presente | P1 |
| BDD-03-12 | dos ediciones sobre misma versión base | ambas intentan crear sucesora | una gana y la otra recibe conflict | P1 |

## Fixtures

Todos los IDs, nombres, textos clínicos y actores son sintéticos. Los fixtures permanecen y se
identifican mediante `test_run_id`; no se eliminan al finalizar el E2E.
