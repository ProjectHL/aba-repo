# Slice 02: autenticación y persistencia de Clientes

## Estado

Aprobada el 2026-08-17. El 2026-08-18 se autorizó y creó el proyecto remoto exclusivo de staging `ABA_staging`; esta autorización no incluye producción ni publicación web.

Las specs ejecutables separadas están en `slice-02/`: `frontend.md`, `backend.md`, `supabase.md` y `web-publication.md`.

## Resultado de usuario

Un miembro autenticado puede entrar al sistema, consultar únicamente los clientes de su organización y registrar un cliente con datos sintéticos. Un usuario de otra organización no puede leer, modificar ni inferir ese registro.

## Recorrido vertical

```text
Login → sesión Supabase → Data API/RPC → PostgreSQL/RLS → listado actualizado
```

## Decisiones bloqueantes

| ID | Decisión propuesta | Requiere aprobación |
| --- | --- | --- |
| P-01 | `clinicalId` único dentro de cada organización | aprobada |
| P-02 | roles iniciales `admin`, `clinician`, `viewer` | aprobada |
| P-03 | `admin` y `clinician` crean; `viewer` sólo consulta | aprobada |
| P-04 | obligatorios: iniciales, ID clínico, idioma y fecha de nacimiento | aprobada |
| P-05 | guardado explícito; cancelar vuelve al listado sin persistir | aprobada |
| P-06 | alta exitosa navega al detalle placeholder del cliente | aprobada |

La aprobación permite avanzar con contratos, pruebas e implementación local. Cualquier conexión remota conserva su propio punto de autorización.

## Frontend

### Alcance

- Pantalla de login con correo/contraseña y estado de error genérico.
- Guard de rutas para `/clientes` y `/clientes/nuevo`.
- Sustituir el contador simulado por datos de la API.
- Enviar el alta con estado cargando, error recuperable y prevención de doble envío.
- Conservar los valores del formulario si la API falla.
- Añadir `/clientes/:id` como placeholder confirmado tras una creación exitosa.
- Mantener textos que indiquen que staging acepta únicamente datos sintéticos.

### Pruebas

1. Redirige al login cuando no existe sesión.
2. Lista estado vacío y registros autorizados.
3. No realiza doble creación.
4. Mapea validaciones de contrato a campos accesibles.
5. Conserva el formulario ante error de red.
6. Navega al detalle después de una respuesta exitosa.

## Backend NestJS diferido

### Alcance

NestJS sale del camino crítico de Slice 02 y queda documentado en `specs/growth/nestjs-api.md`. No se crea `apps/api` en esta etapa. El frontend usa Supabase Auth, Data API y una RPC atómica protegida por RLS.

### Contrato mínimo de creación

```ts
type CreateClientInput = {
  clientInitials: string
  clinicalId: string
  primaryLanguage: string
  birthDate: string
  guardians?: Array<{ initials?: string; birthDate?: string }>
  siblings?: Array<{ initials?: string; birthDate?: string }>
  livingArrangement?: string
}
```

La edad es derivada y nunca se persiste como valor autoritativo.

### Condición de reactivación

Se evalúa NestJS cuando existan consumidores múltiples, integraciones externas, jobs prolongados, una API pública/versionada o reglas de dominio que dejen de ser manejables con contratos, RLS y funciones PostgreSQL/Edge Functions.

## Supabase

### Alcance

- Migraciones versionadas para `organizations`, `memberships`, `clients`, `guardians`, `siblings` y `audit_events`.
- RLS habilitada en toda tabla expuesta.
- Políticas separadas para `SELECT`, `INSERT` y `UPDATE` con membresía organizacional.
- Sin política de `DELETE` y sin borrado físico.
- Restricción única propuesta `(organization_id, clinical_id)`.
- Grants explícitos del Data API.
- Fixtures exclusivamente sintéticos con `test_run_id`.

### Pruebas de seguridad

1. Miembro A puede crear y listar dentro de su organización.
2. Miembro B no accede ni infiere filas de A.
3. Usuario autenticado sin membresía no accede a datos de dominio.
4. Rol anónimo no lee ni escribe.
5. Una actualización no cambia `organization_id`.
6. La clave publicable no puede evadir RLS.

## Publicación web de pruebas

### Alcance

- Un único entorno de staging no indexable.
- Variables públicas de frontend limitadas a Supabase; ningún secreto en el bundle.
- Encabezados de seguridad y HTTPS.
- Smoke test: login → listado → alta sintética → detalle placeholder.
- Banner visible: “Entorno de prueba — no ingresar datos reales”.

### Fuera de alcance

- Producción.
- Dominio definitivo.
- Datos reales o migraciones desde el sistema perdido.
- Telemetría que capture formularios o información sensible.

## Secuencia TDD

1. Completado: aprobar P-01 a P-06; congelar el contrato compartido al cerrar la spec Supabase.
2. Escribir pruebas RLS negativas antes de las políticas.
3. Escribir pruebas del repositorio Supabase antes de conectarlo.
4. Escribir pruebas frontend contra un adaptador Supabase simulado.
5. Implementar el mínimo necesario en Supabase y frontend.
6. Ejecutar integración completa con datos sintéticos.
7. Publicar staging sólo con autorización explícita.
8. Ejecutar smoke test y registrar evidencia dentro del workspace.

## Definition of done

- Las cuatro áreas de esta spec cumplen sus pruebas.
- Contratos frontend/Supabase coinciden y los tipos generados quedan versionados.
- Pruebas RLS positivas y negativas aprobadas.
- No hay secretos ni datos reales en repositorio, logs o fixtures.
- Build reproducible del frontend.
- Staging verificado únicamente si el usuario autoriza la publicación.
