type EnvironmentBannerProps = {
  environment?: string
}

export function EnvironmentBanner({
  environment = import.meta.env.VITE_APP_ENV,
}: EnvironmentBannerProps) {
  if (environment !== "staging") {
    return null
  }

  return (
    <div
      className="bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-950 print:hidden"
      role="status"
    >
      Entorno de pruebas · No ingresar datos reales ni de pacientes antiguos ·
      Datos exclusivamente sintéticos
    </div>
  )
}
