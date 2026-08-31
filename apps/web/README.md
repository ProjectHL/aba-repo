# ABA Data Hub — frontend de reconstrucción

Aplicación React, Vite, Tailwind y shadcn/ui conectada exclusivamente al proyecto Supabase de
staging. No ingresar información real, histórica ni identificable de pacientes.

## Desarrollo local

Desde `apps/web`, ejecutar:

```powershell
pnpm dev
```

El comando carga el modo `staging` de forma explícita. Si faltan las variables públicas de
Supabase, la aplicación se detiene en una pantalla segura y no intenta operar con datos.

`pnpm dev:bare` inicia Vite sin configuración de staging y sólo se conserva para diagnosticar el
gate de variables; no sirve para probar flujos funcionales.

## Verificaciones de desarrollo

```powershell
pnpm test
pnpm typecheck
pnpm lint
```

Las credenciales, tokens, claves secretas y datos clínicos no se registran en archivos, capturas ni
logs. El frontend sólo utiliza la clave pública de Supabase; nunca `service_role` ni claves secretas.
