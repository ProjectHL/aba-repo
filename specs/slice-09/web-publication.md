# Slice 09 / Publicación web

- No publicar una versión por pantalla.
- Agrupar varios lotes de frontend antes de crear una nueva versión de Sites.
- Mantener el Site privado y el banner de datos exclusivamente sintéticos.
- El build final y el smoke publicado se ejecutan junto al QA de cierre.

## Lote 05A

- Los informes permanecen sólo locales hasta cerrar el bloque de pulido e impresión (05B).
- La hoja imprimible conserva el banner de datos exclusivamente sintéticos y evita incluir
  identificadores innecesarios.

## Lote 05B

- El pulido permanece local; no autoriza una publicación independiente.
- Se conserva `Cache-Control: no-store` y `X-Robots-Tag: noindex, nofollow` en el worker público.
- Antes de la publicación agrupada se requiere una revisión manual en navegador de impresión y
  responsive con un expediente exclusivamente sintético.

Estado: el código local está listo para esa revisión; no se publicó ni se ejecutó build en este
lote para respetar la regla de no reemplazar `dist`.
