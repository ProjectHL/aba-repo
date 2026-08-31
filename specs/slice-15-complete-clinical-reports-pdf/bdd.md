# Slice 15 / BDD propuesto

## Estado

Escenarios de aceptación para ejecutar sólo después de aprobar la spec e implementar con TDD.
Todos usan fixtures sintéticos y un profesional autenticado autorizado para el expediente.

### RPT-01 · rango y progreso

**Dado** un expediente con sesiones dentro y fuera del rango, mediciones y ensayos sintéticos  
**Cuando** el profesional aplica un rango inclusivo válido  
**Entonces** ve sólo sesiones y puntos dentro del rango, los porcentajes se calculan con esos
ensayos y la alternativa textual coincide con los gráficos.

### RPT-02 · evaluación compatible

**Dado** un expediente con entrevista, preferencias y evaluación funcional de versiones aprobadas  
**Cuando** abre el informe de evaluación  
**Entonces** ve los campos persistidos permitidos agrupados por tipo, sin adjuntos, JSON crudo ni
conclusiones generadas.

### RPT-02 · payload no soportado

**Dado** un registro con versión de payload desconocida  
**Cuando** se compone el informe  
**Entonces** el registro se marca como no soportado, no se renderiza su JSON y no se permite
presentar el informe como completo.

### RPT-03 · contenido completo aprobado

**Dado** un expediente con fuentes sintéticas válidas en todas las secciones aprobadas  
**Cuando** abre el informe completo  
**Entonces** ve encabezado mínimo, evaluación, adquisición, reducción y progreso con trazabilidad a
sus registros, sin afirmar diagnóstico ni aprobación profesional.

### Vacío válido

**Dado** un expediente autorizado sin registros dentro del rango  
**Cuando** abre cualquiera de los informes  
**Entonces** ve un estado vacío específico, puede cambiar el rango y no se confunde vacío con error.

### Error atómico

**Dado** que falla una fuente requerida de RPT-03  
**Cuando** el usuario solicita el informe o PDF  
**Entonces** conserva la vista recuperable, puede reintentar y no descarga un PDF rotulado como
completo.

### Aislamiento

**Dado** que una respuesta contiene un `clientId` distinto  
**Cuando** se valida el modelo  
**Entonces** se bloquea la composición, no se muestra el dato discordante y el error no expone
detalles internos.

### PDF local minimizado

**Dado** un RPT-03 válido y visible  
**Cuando** el profesional activa una vez `Descargar PDF del informe completo`  
**Entonces** se genera una sola descarga local, su contenido equivale a la vista aprobada, no hay
subida ni auditoría remota y se excluyen todos los campos prohibidos.

### PDF con teclado y fallo

**Dado** el botón de PDF enfocable  
**Cuando** se activa por teclado y el navegador falla al generar el archivo  
**Entonces** aparece un error accesible, el informe permanece intacto y se ofrece reintentar.

### Responsive e impresión

**Dado** un informe con varias secciones y gráficos  
**Cuando** se revisa a 320 px y en modo impresión  
**Entonces** no hay overflow del viewport, el contenido textual sigue disponible y navegación,
botones, banner y mensajes técnicos no aparecen impresos.
