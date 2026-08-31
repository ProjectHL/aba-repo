# Handoff — Slice 14 formularios clínicos, spec lista (2026-08-25)

## Resultado

Se creó una sola spec paraguas para cerrar todos los formularios clínicos en frontend, manteniendo
cuatro capas obligatorias dentro del mismo paquete. Auditoría independiente: `READY FOR APPROVAL`,
sin P0/P1 documentales abiertos.

Ruta: `specs/slice-14-clinical-forms-frontend-closure/`.

## Cobertura

- alta base y familia;
- contexto hogar/colegio temporal;
- diagnósticos, evaluaciones históricas, procedimientos y medicamentos temporales;
- entrevista, preferencias y funcional;
- programas, metas y planes;
- sesión por cuatro dimensiones;
- consentimiento/acceso bloqueados correctamente;
- navegación `Continuar` hasta Informes.

## Decisión de seguridad

Contexto e historia se implementan sólo en memoria React: sin storage, URL, red o falsa confirmación.
Supabase no cambia. Módulos ya conectados conservan RLS/repositorios existentes. Datos reales,
Storage, producción y despliegue siguen prohibidos.

## Primera tarea tras aprobación

CF-01 TDD: componente común, máquina de estados, validador sintético, provider aislado por cliente y
brújula de navegación. Primeras pruebas rojas: foco en invalidación, doble submit, saved-stale sin
duplicar, error conserva valores, draft A/B aislado, remount borra y Escape devuelve foco.

No se implementó código ni se modificó Supabase durante este trabajo de especificación.
