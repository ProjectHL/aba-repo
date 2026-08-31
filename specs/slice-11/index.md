# Slice 11 — Preparación de release privado del MVP

## Estado

**Activa para preparación, no para despliegue.** Parte del candidato local verificado y convierte
los gates de publicación en una lista ejecutable. No autoriza publicar, crear hosting, cambiar
Redirect URLs, invitar usuarios ni usar datos reales.

## Gate de salida

1. candidato local verificable identificado;
2. propietario de hosting, URL privada y audiencia autorizados;
3. Redirect URLs y headers configurados con autorización separada;
4. smoke privado con datos sintéticos; y
5. autorización explícita de despliegue.

## Fronteras

- `frontend.md`: candidato y rendimiento.
- `supabase.md`: Auth/RLS y límites de staging.
- `backend.md`: ausencia de backend privilegiado.
- `web-publication.md`: checklist de release y stop condition.
