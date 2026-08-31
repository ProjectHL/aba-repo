# Slice 03 / Frontend clínico y privacidad

## Alcance

Diseñar la experiencia necesaria para información, consentimiento, control de acceso, derechos del titular y prevención de ingreso accidental de datos reales en entornos no autorizados.

## Requisitos

- Banner inequívoco por entorno; staging muestra `NO INGRESAR DATOS REALES` en login y formularios.
- Aviso de privacidad versionado, accesible antes y después del registro.
- Consentimiento granular con finalidad, responsable, destinatarios/encargados, transferencias, retención, derechos y revocación.
- Flujo para representante legal con verificación de relación y vigencia.
- Información adaptada a niños y adolescentes, registro de entrega y opinión/participación según edad y madurez.
- Ficha muestra quién tiene acceso y por qué; no revela miembros de toda la organización.
- Bloqueo de copiar/pegar o exportar no se considera control suficiente; se requiere autorización y auditoría del servidor.
- Exportación y portabilidad requieren reautenticación, motivo, confirmación de destinatario y canal seguro.
- Inactividad cierra o bloquea la sesión; vistas sensibles no se almacenan en caché compartida.
- Mensajes, URLs, analytics y telemetría nunca contienen campos clínicos ni identificadores directos.

## Pruebas TDD

1. Staging rechaza o interrumpe entradas que aparenten RUT/correo/nombre real y explica la política; el control es preventivo, no una garantía de anonimización.
2. Usuario sin relación asistencial no observa ni metadatos de existencia.
3. Consentimiento faltante bloquea sólo finalidades que realmente dependan de él.
4. Consentimiento antiguo no se reutiliza después de un cambio material de finalidad/texto.
5. Representante vencido o no verificado no autoriza acceso.
6. Exportación requiere sesión reforzada y queda auditada.
7. Menor recibe contenido comprensible y el sistema conserva evidencia de haber sido informado.
8. Logout, timeout y cambio de rol invalidan acceso inmediato.

## Fuera de alcance hasta aprobación jurídica

- firma electrónica específica;
- decisiones clínicas automatizadas;
- grabación de sesiones, audio, video o biometría;
- analítica de comportamiento;
- ingreso de texto clínico libre.

