# Slice 10A — estado de guardado confiable

Fecha: 2026-08-24  
Alcance: frontend local; sin modificación de staging ni creación de datos.

## Hallazgo corregido

`FormPreview` leía `event.currentTarget` después de una operación asíncrona. Al terminar `await`,
esa referencia podía dejar de estar disponible y `reset()` lanzaba una excepción. La escritura ya
había respondido correctamente, pero la UI caía al estado `No pudimos guardar el borrador.`

La corrección guarda la referencia al formulario antes de `await`, usa esa referencia para
`FormData` y `reset()`, y separa dos resultados:

- `saved`: creación y refresco correctos;
- `saved-stale`: creación confirmada, pero no se pudo refrescar la lista. La UI permite
  `Reintentar actualización` sin invocar nuevamente la creación.

## Prueba de regresión

`client-detail-page.test.tsx` simula creación exitosa de un programa y fallo de su refresco. Verifica
el aviso de guardado confirmado, ausencia del mensaje de falso error, reintento de actualización y
que `createProgram` se invoca exactamente una vez.

## Gates

- Vitest: 19 archivos, 91 pruebas correctas.
- TypeScript: correcto (`tsc --noEmit`).
- ESLint: correcto.

No se ejecutó el retest autenticado de navegador porque no había una pestaña/sesión disponible al
cierre. Ese retest sigue siendo requisito para cerrar 10A como evidencia E2E.
