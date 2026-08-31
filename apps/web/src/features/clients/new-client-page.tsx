import { useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ClientForm } from "@/features/clients/client-form"
import { useClientsRepository } from "@/features/clients/clients-repository-context"
import { DomainError, normalizeSupabaseError } from "@/lib/supabase/domain-error"

export function NewClientPage() {
  const navigate = useNavigate()
  const repository = useClientsRepository()
  const testRunId = useRef(crypto.randomUUID())
  const [serverError, setServerError] = useState<DomainError | null>(null)

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost">
        <Link to="/clientes">
          <ArrowLeft aria-hidden="true" /> Volver a clientes
        </Link>
      </Button>
      <ClientForm
        onCancel={() => navigate("/clientes")}
        onSubmit={async (values) => {
          setServerError(null)
          try {
            const client = await repository.create(values, testRunId.current)
            navigate(`/clientes/${client.id}`, { replace: true })
          } catch (error) {
            setServerError(error instanceof DomainError ? error : normalizeSupabaseError(error))
          }
        }}
        serverError={serverError}
      />
    </div>
  )
}
