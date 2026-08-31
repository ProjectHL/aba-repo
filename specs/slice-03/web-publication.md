# Slice 03 / Publicación de entorno clínico

## Separación

El Site privado de Slice 02 es un entorno de pruebas sintéticas. No se promociona ni renombra como producción y no aloja datos clínicos reales.

## Requisitos del hosting de producción

- contrato/DPA que identifique encargado, subencargados, regiones, soporte e incidentes;
- mecanismo aprobado para transferencias internacionales;
- acceso administrativo individual con MFA y mínimo privilegio;
- HTTPS/HSTS, CSP estricta, `frame-ancestors`, `nosniff`, referrer restrictivo y caché privada/no-store en vistas sensibles;
- despliegues inmutables, revisión, rollback no destructivo y separación de variables;
- logs sin URLs, formularios, identificadores ni payload clínico;
- monitoreo de disponibilidad y seguridad con retención aprobada;
- inventario de assets/terceros: sin analytics, grabación de sesión, CDN, fuentes o scripts no aprobados;
- pruebas de refresh de rutas, autorización antes de render y ausencia de datos en HTML/estado inicial.

## Gate de proveedor

Antes de elegir Sites u otro proveedor para producción, el responsable jurídico debe aceptar por escrito el contrato, ubicación, transferencia, subencargados, controles, exportación y terminación. Que un servicio permita un despliegue privado no prueba idoneidad para ficha clínica.

## Pruebas

1. Usuario no autorizado no recibe contenido ni metadatos sensibles.
2. Caché, navegador, service worker y CDN no conservan respuestas clínicas.
3. Source maps, errores y observabilidad no contienen datos personales.
4. Una versión comprometida puede desactivarse y reemplazarse preservando evidencia.
5. La URL de staging mantiene advertencia visible y política de datos sintéticos.

