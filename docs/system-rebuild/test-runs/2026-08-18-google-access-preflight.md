# Preflight: acceso público con Google

Fecha: 2026-08-18  
Ambiente: staging, datos exclusivamente sintéticos.

## Implementado

- Botón `Crear cuenta o continuar con Google` como acceso principal.
- Estado previo a OAuth visible y seguro: con el proveedor deshabilitado, el botón no redirige y
  muestra un aviso de configuración.
- Puerto `signInWithGoogle` sobre Supabase `signInWithOAuth`.
- Retorno al mismo origen en `/clientes`.
- Consulta de membresía propia después de autenticar.
- Identidad sin membresía → `pending`, sin acceso a Clientes.
- Membresía inactiva → pantalla bloqueada, sin acceso a Clientes.
- Cierre de sesión disponible en ambos estados.
- Correo/contraseña se conserva temporalmente mientras el Site siga privado.

## Evidencia

- Vitest: 48/48 PASS.
- TypeScript: PASS.
- ESLint: PASS.
- Supabase Auth settings: Google `false`, email `true`, signup habilitado.
- RLS y revocación existentes permanecen como capa de autorización.
- Site privado actualizado y verificado en navegador: botón visible, aviso enfocado y sin salida del
  mismo origen.

## Decisión

**NO-GO para cambiar Sites a público todavía.** El proveedor Google debe configurarse y probarse primero. El Client Secret no se solicita por chat ni se guarda en archivos.

## Gate externo

1. Crear OAuth Client Web en Google Cloud.
2. Registrar callback `https://arfwuctpwnnuhdgjtxaa.supabase.co/auth/v1/callback`.
3. Activar Google en Supabase Auth Providers con Client ID y Client Secret.
4. Configurar Site URL/redirect permitido del Site staging.
5. Informar `Google habilitado` para ejecutar smoke, publicación privada y recién después cambio público.
