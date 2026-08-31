# Slice 10 / Publicación y QA

No hay publicación autorizada en este slice. La publicación agrupada sólo puede evaluarse después de
10A–10D y con autorización explícita.

## Gate de QA final

- E2E autenticado sintético desde login/cliente hasta informe, sin falso error de guardado ni
  duplicación al reintentar.
- Vista móvil de 320 px, navegación de teclado, foco y mensajes de error/éxito accesibles.
- Impresión manual del informe sin controles ni datos no necesarios.
- Para el JPG local aprobado de S-12: comprobar que sólo contiene una serie visible, período,
  iniciales, ID clínico sintético y la marca de datos sintéticos; sin red, Storage ni archivo
  remoto. Verificar el mensaje accesible de fallo y el estado sin datos.
- Smoke de recuperación de contraseña verificado el 2026-08-25 por el responsable: Supabase envió
  el enlace directo y el cambio de contraseña completó su flujo. No se documentan secretos ni se
  autoriza modificar Redirect URLs.
- Cabeceras de no-caché/no-index y variables públicas de staging verificadas en el artefacto que se
  vaya a publicar.

El reporte de QA debe enlazar capturas o resultados sintéticos, no tokens, correos, IDs de usuario,
contraseñas ni payload clínico. Un fallo P0/P1 bloquea publicación; los formatos de exportación se
prueban por separado antes de incluirlos en el smoke.

## 10D — spec activa de QA

### Estado 2026-08-25

Verificada en navegador y con datos sintéticos. El JPG de S-12 se activó por teclado sin errores;
la herramienta de navegador no expone el archivo originado por URL `data:`, por lo que la evidencia
combina esta activación con la prueba local de minimización. La vista de impresión, el viewport de
320 px y la recuperación de contraseña fueron comprobados dentro de los límites documentados. No
se autoriza publicación.

### Alcance aprobado

Ejecutar sólo en navegador autenticado y con el expediente sintético ya autorizado: validar el JPG
local de S-12, viewport de 320 px, navegación de teclado y foco, vista de impresión y flujo de
recuperación hasta su pantalla de confirmación. No publicar, cambiar Redirect URLs, enviar correos,
ni incorporar archivos o datos reales.

### Primera prueba y evidencia

Antes de cualquier cambio de código, una prueba de componente debe fallar si el control JPG se
presenta sin una serie o si el contenido representado incorpora fecha de nacimiento. La evidencia
de navegador debe registrar los estados visibles y cualquier defecto sin capturar tokens, correos
ni artefactos descargados.

### Criterios de aceptación

- El JPG local sólo contiene el contexto mínimo aprobado y no solicita red.
- A 320 px, los controles permanecen operables; con teclado, el foco y los mensajes son visibles.
- La impresión no incluye controles ni campos excluidos.
- La recuperación se detiene antes de enviar o confirmar un cambio de contraseña.
- Todo P0/P1 bloquea publicación; si no hay defectos, se crea evidencia y handoff, no una
  publicación automática.

### Stop condition

Detener y solicitar autorización separada si el navegador pide enviar un correo, cambiar una
contraseña, descargar/guardar un archivo fuera de la verificación local, modificar Redirect URLs o
publicar.
