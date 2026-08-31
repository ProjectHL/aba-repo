# Slice 10 / Backend y límites de servicio

No se introduce NestJS ni un backend privilegiado para las fases 10A y 10B. React continúa usando
Supabase Auth, Data API y la RPC atómica con clave publicable y RLS.

La fase 10C aprobó por especificación una descarga JPG local, efímera y por serie de S-12. No
introduce NestJS, endpoint ni credencial adicional.

Las demás exportaciones deberán decidir por especificación, antes de código, si son:

1. composición local efímera en el navegador;
2. descarga de un archivo generado en cliente; o
3. un servicio de generación con autorización, auditoría y retención explícitas.

La elección no puede inferirse desde la existencia de un botón. Si se propone una API propia, crear
un slice separado con amenaza, contrato, autorización, minimización y pruebas; no reutilizar un
secreto de Supabase en el frontend ni en scripts de evidencia.
