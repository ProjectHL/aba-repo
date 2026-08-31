# Slice 10 / Frontend

## 10A — confiabilidad de guardado (P0)

La UI debe distinguir un rechazo real de una escritura confirmada. En particular, no puede mostrar
`No pudimos guardar el borrador` si la creación remota ya respondió con un registro válido.

1. Añadir primero pruebas de componente para cada creación: evaluación, programa, meta y plan.
2. Las pruebas deben cubrir respuesta PostgREST con timestamp PostgreSQL válido y el refresco de
   sus listas posteriores; no se permite depender de F5 para ver el conteo correcto.
3. Si se confirma escritura pero falla el refresco, el estado debe comunicar guardado confirmado y
   actualización pendiente, conservando una acción de reintento. No debe inducir a duplicar el
   registro.
4. La validación de timestamps acepta representaciones PostgreSQL interpretables; no exige sólo el
   separador `T` de ISO.

### Estado 2026-08-25

Implementado en código y cubierto por prueba de componente: el formulario conserva la referencia
del formulario antes de `await`, evitando que `event.currentTarget` se pierda al volver de una
escritura. El refresco posterior fallido ahora informa un guardado confirmado y ofrece
`Reintentar actualización`, sin volver a crear el registro. El retest autenticado de staging
del 2026-08-25 guardó una evaluación, un programa, una meta y un plan sintéticos con confirmación
visible, sin falso error ni reintentos duplicados; la recarga conservó los cuatro contadores.

## 10B — paridad de formularios

### Decisión de alcance: cierre frontend (2026-08-24)

Se autoriza cerrar las pantallas, campos y estados visibles de S-05 a S-13 sin ampliar Supabase.
El frontend puede enviar campos nuevos dentro del `payload` JSON ya existente cuando el repositorio
actual lo soporte; no añade columnas, Storage, uploads persistentes, archivos remotos, reglas de
retención ni correcciones clínicas. Un selector de archivo, si se muestra, debe comunicar de forma
inequívoca que la persistencia del adjunto está pendiente y no afirmar que se cargó a staging.

Las exportaciones se cierran como vistas imprimibles locales y acciones claramente etiquetadas como
`Imprimir` mientras formato descargable, minimización y autorización sigan pendientes de 10C.

| Pantalla | Ya conectado | Evidencia que falta modelar | Estado para implementación |
| --- | --- | --- | --- |
| S-05 Entrevista | 4 campos base y fortalezas/necesidades por informante | jerarquía y columnas dinámicas | contenido persistido en `payload`; la matriz configurable requiere modelo aprobado |
| S-06 Preferencias | fecha, tipo, preferencias alta/baja, topografía y notas | adjunto remoto | campos persistidos en `payload`; selector de archivo informa que Storage sigue pendiente |
| S-07 Funcional | fecha, tipo, topografía, antecedentes/consecuencias e hipótesis | adjunto remoto | campos persistidos en `payload`; selector de archivo informa que Storage sigue pendiente |
| S-09 Adquisición | programa, meta, procedimiento, ayudas, respuesta correcta, generalización y mantenimiento | estructura clínica separada por campo | complementos se conservan etiquetados dentro de `teaching_procedure` existente; no se crea esquema nuevo |
| S-10 Reducción | plan, función, estrategias, línea base, fuente, nivel e intensidad | estado/corrección y descarga | complementos se conservan etiquetados dentro de `operational_definition`; impresión queda en 10C |
| S-11 Sesión | fecha, notas, frecuencia y ensayos correcto/incorrecto | duración, historial y corrección | captura atómica disponible; no se inventan reglas de corrección |

### Estado 2026-08-24 — cierre visual de pantallas

S-08 (`/informes/evaluacion`) y S-13 (`/informes/completo`) ya son rutas protegidas y vistas
imprimibles separadas de S-12 (`/informes`). Las tres comparten el selector de expediente y
período, muestran los estados de carga/error/vacío y limitan la información impresa a los
indicadores derivados autorizados. No prometen descarga de PDF, DOCX, CSV o JPG: la acción es
`Imprimir` y el formato exportable permanece en 10C.

Los 13 destinos de pantalla del catálogo tienen ahora una representación frontend. Esto no
equivale a cerrar los contratos de adjuntos, correcciones, duración ni formatos de exportación;
esas capacidades requieren su correspondiente especificación de Supabase/backend antes de pasar
de interfaz a funcionalidad persistente.

Los campos que el catálogo marca como parcialmente visibles o de nombre incierto no se implementan
como obligatorios sin aprobación. Los campos confirmados se presentan como opcionales cuando la
obligatoriedad no fue observada. Cada formulario nuevo o ampliado exige estados accesibles de vacío,
carga, validación, guardado, error y éxito, y pruebas de teclado.

## 10C — informes y exportación

- S-08 y S-13 son pantallas nuevas, no botones decorativos en `/informes`.
- Impresión local existente se mantiene separada de descarga/exportación.
- La única descarga aprobada es un JPG local y efímero por serie visible de S-12 para el
  profesional autenticado. Incluye sólo la serie, período, iniciales, ID clínico sintético y la
  marca de datos sintéticos. Nunca incluye fecha de nacimiento, tutores, notas, adjuntos, perfil
  ni otras series.
- El control se deshabilita sin puntos y comunica un error local accesible si el navegador no
  puede generar la imagen. S-08, S-10 y S-13 mantienen únicamente impresión local.

## Criterios globales

- No degradar el flujo E2E ya comprobado.
- Todo cambio de UI persistente actualiza esta spec y `supabase.md` antes de código.
- Ejecutar prueba focalizada, suite completa, typecheck y lint; una prueba E2E autenticada cierra
  cada fase cuando sea segura de ejecutar con datos sintéticos.
