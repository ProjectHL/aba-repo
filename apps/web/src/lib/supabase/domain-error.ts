export type DomainErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CLINICAL_ID_CONFLICT"
  | "NETWORK_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "INVALID_DATA_RESPONSE"
  | "CLIENT_NOT_FOUND"
  | "UNKNOWN"

export class DomainError extends Error {
  public readonly code: DomainErrorCode
  public readonly field?: string

  constructor(
    code: DomainErrorCode,
    message: string,
    field?: string
  ) {
    super(message)
    this.code = code
    this.field = field
    this.name = "DomainError"
  }
}

function readErrorCode(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined
  return typeof error.code === "string" ? error.code : undefined
}

function isNetworkLike(error: unknown) {
  if (error instanceof TypeError) return true
  if (!error || typeof error !== "object" || !("message" in error)) return false
  return typeof error.message === "string" && /failed to fetch|network/i.test(error.message)
}

export function normalizeSupabaseError(error: unknown): DomainError {
  if (error instanceof DomainError) return error
  if (isNetworkLike(error)) {
    return new DomainError("NETWORK_ERROR", "No fue posible conectar con el servicio")
  }

  const code = readErrorCode(error)
  if (code === "23505") {
    return new DomainError(
      "CLINICAL_ID_CONFLICT",
      "El ID clínico ya está en uso",
      "clinicalId"
    )
  }
  if (code === "42501") {
    return new DomainError("FORBIDDEN", "No tienes permiso para realizar esta acción")
  }
  if (code === "PGRST301") {
    return new DomainError("UNAUTHORIZED", "La sesión ya no es válida")
  }
  if (code?.startsWith("PGRST")) {
    return new DomainError("SERVICE_UNAVAILABLE", "El servicio no está disponible")
  }
  return new DomainError("UNKNOWN", "No fue posible completar la operación")
}
