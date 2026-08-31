# S-ABA-02 / Frontend

Estado: **implementado localmente; producción/publicación bloqueadas**

## Vistas y estados

La pestaña Información agrupa secciones independientes: identificación, familia/contexto, historia
y consentimiento. Cada una representa `loading`, `empty`, `incomplete`, `ready`, `no-permission` o
`error`; nunca convierte “incompleto” en juicio clínico.

- `empty`: explicación y acción sólo si existe capability.
- `incomplete`: faltan campos opcionales de una fila iniciada; no bloquea otras secciones.
- `no-permission`: no renderiza valores previamente cacheados.
- `error`: conserva edición no confirmada y no afirma guardado.
- `ready`: significa contrato válido/persistido, no aprobado clínicamente.

## Formularios

- Los campos R se mantienen en el alta base.
- Contexto e historia usan las longitudes/fechas de Slice 14 hasta aprobar persistencia.
- Cada fila histórica muestra autoría temporal, versión y estado cuando exista.
- “Corregir” crea una nueva versión; no ofrece “eliminar”.
- Terminar medicación solicita fecha no anterior al inicio.
- Consentimiento muestra finalidad, versión, estado, otorgante descrito, canal y fechas.
- No existe selector de archivo, firma, captura de imagen ni enlace público.

## Contrato de vista candidato

~~~ts
type RecordSectionState = "empty" | "incomplete" | "ready" | "no-permission" | "error"

type ConsentSummary = {
  purpose: string
  noticeVersion: string
  status: "not_recorded" | "pending_review" | "valid" | "revoked" | "expired" | "superseded"
  grantedOn?: string
  expiresOn?: string
  channel?: string
}
~~~

El frontend recibe una proyección por capacidad; no descarga el expediente completo para ocultar
campos. La familia no reutiliza esta pantalla profesional.

## Criterios

1. Reload no presenta drafts como persistidos.
2. Un terapeuta no ve referencia/otorgante de consentimiento.
3. Corregir una medicación no sustituye visualmente su versión previa.
4. Revocación de acceso limpia contenido sensible de la vista actual.
5. Ningún texto afirma firma, validez jurídica o aprobación clínica.
