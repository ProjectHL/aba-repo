import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { StudentAccess, StudentRole } from "@/features/clinical/student-record/student-record-repository-contract"
import { useStudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-context"

export function StudentAccessCard({ access, clientId, onChanged }: { access: StudentAccess | null; clientId: string; onChanged: () => void }) {
  const repository = useStudentRecordRepository()
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState<StudentRole>("therapist")
  const [reason, setReason] = useState("")
  const [state, setState] = useState<"idle" | "saving" | "error">("idle")
  const [renderedAt] = useState(() => Date.now())
  const current = access?.currentAssignment
  const revokedDecisionIds = new Set(access?.decisions.filter((item) => item.decision === "revoked").map((item) => item.supersedesDecisionId))
  const activeDecisions = access?.decisions.filter((item) => item.decision === "approved" && !revokedDecisionIds.has(item.id) && (!item.expiresAt || new Date(item.expiresAt).getTime() > renderedAt)) ?? []
  const run = async (action: () => Promise<unknown>) => {
    setState("saving")
    try { await action(); setState("idle"); onChanged() } catch { setState("error") }
  }
  return (
    <Card>
      <CardHeader><CardTitle>Usuarios asignados</CardTitle><CardDescription>Acceso por estudiante; los IDs son técnicos y las identidades de QA son sintéticas.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm"><strong>Tu rol:</strong> {current?.role ?? "sin asignación"}{current?.isPrimary ? " · principal" : ""}</p>
        <ul className="space-y-2 text-sm text-slate-600">{access?.team.map((item) => <li className="flex items-center justify-between gap-2" key={item.id}><span>{item.role}{item.isPrimary ? " principal" : ""} · {item.userId.slice(0, 8)}… · {item.status}</span>{current?.role === "supervisor" && current.isPrimary && item.status === "active" && !item.isPrimary ? <Button size="sm" variant="outline" onClick={() => run(() => repository.setAssignment({ clientId, userId: item.userId, role: item.role, status: "inactive" }))}>Inactivar</Button> : null}</li>)}</ul>
        {current?.role === "coordinator" ? (
          <div className="space-y-2 border-t pt-4"><Label htmlFor="access-reason">Motivo no clínico</Label><Input id="access-reason" maxLength={500} onChange={(event) => setReason(event.target.value)} value={reason} /><Button disabled={!reason.trim() || state === "saving"} onClick={() => run(() => repository.requestAuthorization({ clientId, resourceType: "student", actions: ["student.edit"], reason }))}>Solicitar edición de expediente</Button></div>
        ) : null}
        {current?.role === "supervisor" && current.isPrimary ? (
          <div className="space-y-3 border-t pt-4">
            {access?.requests.filter((request) => request.status === "pending").map((request) => <div className="rounded-lg border p-3 text-sm" key={request.id}><p>{request.resourceType} · {request.requestedActions.join(", ")}</p><p className="text-slate-500">{request.reason}</p><div className="mt-2 flex gap-2"><Button size="sm" onClick={() => run(() => repository.decideAuthorization(request.id, "approved", new Date(Date.now() + 89 * 86400000).toISOString()))}>Aprobar temporalmente</Button><Button size="sm" variant="outline" onClick={() => run(() => repository.decideAuthorization(request.id, "denied"))}>Denegar</Button></div></div>)}
            {activeDecisions.map((decision) => <div className="flex items-center justify-between rounded-lg border p-3 text-sm" key={decision.id}><span>{decision.grantedActions.join(", ")} · vigente hasta {decision.expiresAt ? new Date(decision.expiresAt).toLocaleDateString("es-CL") : "sin fecha"}</span><Button size="sm" variant="outline" onClick={() => run(() => repository.revokeAuthorization(decision.id))}>Revocar</Button></div>)}
            <div className="grid gap-2"><Label htmlFor="assignment-user">ID de usuario sintético</Label><Input id="assignment-user" onChange={(event) => setUserId(event.target.value)} value={userId} /><Label htmlFor="assignment-role">Rol</Label><select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" id="assignment-role" onChange={(event) => setRole(event.target.value as StudentRole)} value={role}><option value="supervisor">Supervisor</option><option value="coordinator">Coordinador</option><option value="therapist">Terapeuta</option><option value="family">Familia</option></select><Button disabled={!userId || state === "saving"} onClick={() => run(() => repository.setAssignment({ clientId, userId, role, status: "active" }))}>Asignar usuario</Button></div>
          </div>
        ) : null}
        {state === "error" ? <p className="text-sm text-rose-700" role="alert">No pudimos completar la operación de acceso.</p> : null}
      </CardContent>
    </Card>
  )
}
