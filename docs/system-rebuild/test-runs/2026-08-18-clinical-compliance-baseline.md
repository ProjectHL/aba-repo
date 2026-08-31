# Evidencia: línea base de cumplimiento clínico Chile

Fecha: 2026-08-18  
Alcance: investigación oficial, specs Slice 03 y barrera preventiva de staging.  
Datos personales utilizados: ninguno.

## Fuentes verificadas

- BCN: Leyes 19.628, 20.584, 21.430 y 21.719.
- BCN/MINSAL: Decreto 41/2012 sobre fichas clínicas.
- Superintendencia de Salud: Monografía de Ficha Clínica 2025.
- Supabase: producción, regiones, responsabilidad compartida, seguridad, backups y DPA.

## Hallazgos

- Información de salud y ficha clínica es dato sensible.
- La ficha clínica se conserva al menos 15 años desde el último ingreso.
- Sólo personas relacionadas directamente con la atención acceden a la ficha, salvo excepciones legales.
- La Ley 21.719 entra en vigor el 2026-12-01 y agrega principios, derechos, incidentes, transferencias, DPIA y sanciones.
- Menores requieren protección reforzada y reglas de representación/autonomía progresiva.
- Staging Supabase está en São Paulo, Brasil; producción requiere aprobar transferencia internacional y proveedores.
- Pacientes antiguos no son datos de prueba; iniciales y reemplazo de identificadores no garantizan anonimización.

## Cambio preventivo

El banner global de staging ahora muestra: `No ingresar datos reales ni de pacientes antiguos`, además de exigir datos exclusivamente sintéticos.

## Verificación frontend

- Vitest: 11 archivos, 32 pruebas aprobadas.
- TypeScript `--noEmit`: aprobado.
- ESLint: aprobado.

La primera invocación de Corepack fue bloqueada porque intentó acceder a caché global/red fuera del workspace. La verificación se ejecutó después con binarios locales de `apps/web/node_modules/.bin`, sin acceso fuera de `aba 2`.

## Resultado

Línea base aprobada como especificación preventiva. Todos los gates C-01 a C-10 permanecen rojos; el resultado no autoriza datos reales ni declara cumplimiento jurídico.

