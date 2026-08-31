const ALLOWED_PRIVATE_PATH = /^\/clientes(?:\/nuevo|\/[a-zA-Z0-9-]+)?$/

export function getSafeReturnPath(state: unknown) {
  if (!state || typeof state !== "object" || !("from" in state)) return "/clientes"
  const from = (state as { from?: unknown }).from
  if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//")) {
    return "/clientes"
  }

  try {
    const candidate = new URL(from, "https://local.invalid")
    if (!ALLOWED_PRIVATE_PATH.test(candidate.pathname)) return "/clientes"
    return `${candidate.pathname}${candidate.search}`
  } catch {
    return "/clientes"
  }
}
