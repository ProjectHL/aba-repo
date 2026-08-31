# Handoff de planificación: Frontend autenticado listo

Fecha: 2026-08-17  
Estado: supersedido el 2026-08-18 por el flujo Supabase-first; consultar `2026-08-18-supabase-first-ready.md`.

## Spec activa posterior

`specs/slice-02/frontend.md`

## Base existente

- React 19, Vite, TypeScript, Tailwind y shadcn/ui.
- React Router declarativo con `/clientes` y `/clientes/nuevo`.
- Formulario React Hook Form y cálculo de edad.
- Siete pruebas, typecheck, lint y build aprobados en el último corte ejecutado.

## Contrato añadido

- Máquina de sesión y guards públicos/privados.
- Login correo/contraseña con error no enumerativo.
- Uso separado de `getClaims` para identidad y `getSession` para obtener el bearer token.
- Transporte HTTP con cancelación, timeout y errores normalizados.
- Estados completos de listado, alta y detalle placeholder.
- Prohibición de cachear datos clínicos en almacenamiento web.
- Doce grupos de pruebas TDD y QA visual/accesible.

## Dependencias que no deben falsearse

La spec está lista, pero la integración no puede declararse completa sin:

1. URL y clave publicable de un Supabase local/staging autorizado;
2. Auth configurada con usuarios exclusivamente sintéticos;
3. OpenAPI Backend verificado;
4. endpoint real de Clientes respaldado por RLS probada;
5. origen local/staging aprobado para CORS.

Mientras esas dependencias falten, se puede avanzar con fakes y pruebas de componentes, nunca con credenciales inventadas.

## Primer test esperado

Con estado Auth `anonymous`, abrir `/clientes/nuevo` redirige a `/login` y conserva únicamente el destino interno seguro para volver después de autenticar.

## Próximo handoff

Después del E2E local completo, continuar con `specs/slice-02/web-publication.md`. Desplegar staging requiere autorización explícita.

## Reglas heredadas

- Todo dentro de `C:\Users\Moonlabpc\Desktop\aba 2`.
- Sin borrado, datos reales, secretos, conexiones o publicaciones no autorizadas.
- shadcn/ui como base y prueba roja antes de implementación.
