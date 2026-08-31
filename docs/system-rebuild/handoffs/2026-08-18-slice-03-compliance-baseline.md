# Handoff: Slice 03 cumplimiento clínico Chile

Fecha: 2026-08-18  
Estado: línea base creada; datos reales bloqueados.

## Entregables

- Línea base legal de Leyes 19.628, 20.584, 21.430 y 21.719, más Decreto 41/2012.
- Política obligatoria de datos sintéticos para pruebas.
- Specs separadas de cumplimiento, frontend, backend, Supabase y publicación.
- Gates C-01 a C-10 para habilitar el primer dato real.
- Riesgos de ficha clínica, menores, datos históricos, retención, incidentes y transferencia a Brasil documentados.

## Decisiones

- Staging no recibe pacientes actuales ni antiguos.
- Iniciales/ID clínico/fecha de nacimiento no equivalen a anonimización.
- ABA Data Hub no se declara ficha clínica electrónica habilitada.
- La regla local de no borrado no se traslada a producción; producción requiere retención y eliminación legal gobernada.
- Supabase staging no se promociona a producción.

## Siguiente spec ejecutable

`specs/slice-03/compliance.md`: identificar responsable/prestador, clasificar módulos y completar inventario de tratamientos. Requiere decisiones del titular del proyecto y validación de abogado chileno antes de implementación técnica.

