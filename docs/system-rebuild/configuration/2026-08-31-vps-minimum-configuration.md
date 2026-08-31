# Configuración mínima para ejecutar ABA Data Hub en un VPS

Fecha: 2026-08-31  
Estado: **guía de preparación; no autoriza compra, DNS, servidor, credenciales ni despliegue**

## Objetivo

Definir el mínimo verificable para alojar una versión privada de ABA Data Hub en un VPS y comenzar
pruebas exclusivamente con datos sintéticos. Esta guía sirve de base para un proyecto de despliegue
limpio y separado; no modifica la versión 14 publicada ni sustituye sus evidencias.

## Alcance y no objetivos

- Alcance: una SPA React/Vite estática, HTTPS, reverso Nginx, Supabase `ABA_staging` y acceso
  restringido para pruebas.
- No incluye producción, pacientes o datos reales, migraciones, acceso `service_role`, Storage,
  correo transaccional, copias de datos, monitoreo comercial ni publicación pública.
- La elección de proveedor, dominio, tamaño del VPS, región, cuenta de DNS y usuarios autorizados
  permanece pendiente de decisión del titular.

## Arquitectura mínima propuesta

> Inferido para VPS: el frontend se compila en un artefacto estático y Nginx lo sirve. El Worker de
> Sites no se copia al VPS ni se usa como runtime; el VPS no dispone del binding `ASSETS` de Sites.

```text
Navegador autorizado
  └─ HTTPS :443
       └─ Nginx (VPS)
            └─ SPA estática de ABA Data Hub
                 └─ HTTPS → Supabase ABA_staging (Auth, Data API y RPC con RLS)
```

## Datos de configuración

| Variable o valor | Dónde se define | Clasificación | Regla |
| --- | --- | --- | --- |
| `VITE_APP_ENV=staging` | build del frontend | pública | Mantiene visible el banner de entorno sintético. |
| `VITE_SUPABASE_URL` | build del frontend | pública | Debe apuntar exclusivamente a `ABA_staging`. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | build del frontend | pública | Nunca sustituir por `service_role` ni clave secreta. |
| `APP_ORIGIN` | configuración de Nginx y Supabase Auth | pública | Dominio HTTPS exacto elegido para el VPS. |
| `DEPLOY_SSH_PUBLIC_KEY` | VPS | pública | Única clave autorizada inicialmente; no usar contraseñas SSH. |
| certificados TLS | VPS/Nginx | secreto operativo | No se guardan en el repositorio ni en el bundle. |

No crear `.env` con secretos en el repositorio. Si se usa un archivo local de build, debe permanecer
fuera de control de versiones y disponer sólo de variables públicas `VITE_*` necesarias.

## Requisitos del VPS

1. Sistema Linux LTS administrado, con actualizaciones de seguridad activas.
2. Cuenta administrativa sin login por contraseña, acceso SSH sólo con clave pública y un usuario
   operativo sin privilegios para servir los artefactos.
3. Firewall: permitir únicamente `80/tcp`, `443/tcp` y SSH restringido a la IP/red administrativa
   que se acuerde; denegar el resto de entradas.
4. DNS: registro `A` o `AAAA` del subdominio de staging hacia la IP del VPS antes de emitir TLS.
5. Nginx y un emisor de certificado TLS renovable. El dominio final, proveedor de certificados y
   método de renovación son decisiones pendientes; no se asumen en esta guía.
6. Un directorio de releases con permisos del usuario operativo y versiones fechadas inmutables.
   La activación debe apuntar a una nueva versión, nunca sobrescribir ni borrar la anterior.

## Nginx: comportamiento mínimo requerido

- Redirigir HTTP a HTTPS.
- Servir el directorio de release activo con `index.html`.
- Aplicar fallback SPA sólo a rutas de aplicación; rutas inexistentes bajo `/assets/` deben devolver
  404 real.
- Incluir al menos `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, política de
  referrer restrictiva, `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store` para HTML y
  HSTS únicamente después de verificar HTTPS estable.
- Usar `Content-Security-Policy` que permita `self` y el endpoint exacto de `ABA_staging` en
  `connect-src`; no añadir comodines ni endpoints de producción.
- No registrar cuerpos de formularios, tokens, IDs clínicos, fechas de nacimiento ni cabeceras de
  autorización.

## Integración obligatoria con Supabase staging

Antes de una primera prueba, el origen HTTPS exacto del VPS debe estar autorizado en la configuración
de redirecciones/Auth de `ABA_staging`. La aplicación conserva sesión y autorización mediante
Supabase Auth y RLS; Nginx no recibe ni decide roles clínicos. No se requieren ni permiten claves
privilegiadas en el VPS para el flujo ordinario.

## Proyecto de despliegue limpio — contrato propuesto

Cuando se autorice crear el proyecto limpio, se hará dentro de este workspace y sin tocar el código
actual ni los artefactos históricos. Contendrá sólo:

```text
deployment/vps/
├── README.md                 # propósito, límites y rollback no destructivo
├── nginx/                    # plantilla sin dominio ni certificados reales
├── scripts/                  # build, empaquetado y verificación sin secretos
├── releases/                 # artefactos fechados; nunca se borran automáticamente
└── .env.example              # sólo nombres de variables públicas, sin valores
```

La creación de ese proyecto, la instalación de software en un VPS y cualquier despliegue requerirán
autorizaciones separadas.

## Gate «listo para publicar una versión»

Se podrá declarar el proyecto **listo para publicar una versión privada de pruebas** sólo cuando
todas estas condiciones tengan evidencia:

1. El candidato local compila y supera el preflight aplicable al runtime VPS.
2. La validación de ID clínico permanece verde con 148/148 o más pruebas, tipos y lint.
3. El empaquetado del VPS no depende del Worker ni del binding `ASSETS` de Sites.
4. Configuración Nginx validada para HTTPS, headers, fallback SPA y 404 de assets.
5. Variables públicas de staging verificadas sin secretos en artefactos o logs.
6. Redirección/Auth de Supabase preparada para el dominio HTTPS exacto.
7. Plan de activación y recuperación no destructiva documentado: nueva release, smoke sintético,
   conservar release previa.
8. Autorización explícita para desplegar al VPS privado.

La publicación no significa E2E concluido: la creación del fixture `UV / E2E-SABA03-20260831` y
BDD-03-01–12 seguirán requiriendo confirmación puntual y evidencia separada.

## Próximo paso autorizado por esta guía

El siguiente trabajo local puede ser especificar y construir el proyecto limpio de empaquetado VPS,
incluyendo pruebas de Nginx y preflight específico. No se debe crear ni configurar un VPS hasta que
el titular contrate el servicio y entregue autorización explícita para ese entorno.
