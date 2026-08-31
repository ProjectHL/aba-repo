# Plan de clonación: ABA Data Hub

## Objetivo

Reconstruir un MVP frontend navegable, basado únicamente en evidencia del canal, y preparar contratos para un backend nuevo. No se intentará recuperar el backend, datos ni secretos originales.

## Restricciones operativas

- Todo el trabajo local ocurre dentro de `C:\Users\Moonlabpc\Desktop\aba 2`.
- Ningún agente o subagente puede inspeccionar o acceder a otra carpeta sin permiso explícito del usuario para una ruta y acción concretas.
- No se elimina ningún archivo, carpeta, registro, recurso remoto ni dato del sistema.
- Los ejecutables instalados pueden utilizarse como herramientas, pero el directorio de trabajo y todos los artefactos del proyecto permanecen dentro de `aba 2`.
- Las fuentes web autorizadas se consultan en modo lectura; cualquier captura o descarga se guarda dentro del proyecto.

## Evidencia inicial conocida

| ID | Fuente | Hallazgo | Confianza |
|---|---|---|---|
| E-001 | Video 00:04–00:31 | Pantalla de gestión/alta de cliente con iniciales, ID de cliente, idioma, fecha de nacimiento y edad calculada. | observada |
| E-002 | Video 00:04–00:31 | Sección de información familiar y convivencia: padres/tutores, hermanos y pregunta de convivencia. | observada |
| E-003 | Video, interfaz visible | Navegación superior con Clientes e Informes. | observada |

## Fases y entregables

1. **Forense visual.** Extraer fotogramas, inventario de evidencia, catálogo de pantallas y preguntas abiertas.
2. **Especificación de flujos.** Definir journeys observados, estados propuestos y criterios de aceptación trazables.
3. **Contratos separados.** Aprobar `specs/frontend.md`, `specs/backend.md`, `specs/supabase.md` y `specs/web-publication.md`, manteniendo sus dependencias explícitas.
4. **Base frontend.** Crear Vite/React/Tailwind con shadcn/ui, rutas, datos ficticios anonimizados, tokens visuales y pruebas.
5. **Slice 1: clientes.** Lista vacía, alta de cliente y formulario familiar observado; primero con adaptador simulado y después con API aprobada.
6. **Persistencia de staging.** Conectar React mediante repositorio a Supabase Auth/Data API/RPC y probar RLS con registros sintéticos. NestJS queda diferido a crecimiento.
7. **Publicación de prueba.** Desplegar web y API en staging, configurar autenticación y ejecutar smoke/E2E sin datos reales.
8. **Slices posteriores.** Incorporar sólo pantallas demostradas: informes, programas, registro de datos y otros módulos que el inventario confirme.
9. **Hardening.** Accesibilidad, responsividad, errores, E2E, validación visual y evaluación de seguridad/privacidad.

## Puertas de aprobación

- Antes de cada slice: aprobar la especificación y toda hipótesis inferida.
- Antes del backend: aprobar modelo de datos, roles, retención y privacidad, porque el dominio podría contener datos de menores y salud.
- Antes de producción: definir titularidad, privacidad, autenticación, respaldo y migración de datos.

## Primer slice propuesto

`Clientes / Añadir nuevo cliente`: reproducir los campos confirmados, calcular edad en cliente y permitir familiares repetibles en memoria; sin login, base de datos remota ni promesa de persistencia.
