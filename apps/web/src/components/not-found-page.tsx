import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="grid min-h-80 place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-blue-700">404</p>
        <h1 className="mt-2 text-2xl font-bold">Página no encontrada</h1>
        <p className="mt-2 text-sm text-slate-600">La ruta solicitada no forma parte de este corte.</p>
        <Button asChild className="mt-5">
          <Link to="/clientes">Volver a clientes</Link>
        </Button>
      </div>
    </div>
  )
}
