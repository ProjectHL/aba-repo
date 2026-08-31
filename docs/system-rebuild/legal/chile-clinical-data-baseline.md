# Línea base legal: datos clínicos y personales en Chile

Fecha de revisión: 2026-08-18  
Estado: línea base técnica para revisión jurídica; no constituye asesoría legal.  
Ámbito: ABA Data Hub, prestadores privados, datos de salud y posible atención de niños, niñas y adolescentes en Chile.

## Decisión inmediata

ABA Data Hub staging continúa autorizado exclusivamente para información sintética. No se permite copiar información de pacientes actuales o antiguos, aunque se sustituyan el nombre o el RUT. Iniciales, fecha de nacimiento, relaciones familiares, identificador clínico y contexto terapéutico pueden permitir reidentificación y, por tanto, siguen siendo datos personales o seudonimizados.

El uso de una ficha antigua para probar software es una finalidad distinta de la atención original. Sólo podrá evaluarse después de que un abogado chileno confirme una base de licitud y el responsable apruebe el procedimiento; la alternativa predeterminada es generar datos sintéticos o aplicar anonimización irreversible verificada.

## Normativa base

| Norma | Vigencia relevante | Aplicación al sistema |
| --- | --- | --- |
| Constitución, artículo 19 N.º 4 y Ley 19.628 | vigente | privacidad, protección y tratamiento de datos personales; los estados de salud físicos o psíquicos son datos sensibles |
| Ley 20.584 | vigente | reserva, acceso, portabilidad, consentimiento informado y custodia de la ficha clínica |
| Decreto MINSAL 41/2012 | vigente | contenido, almacenamiento, acceso, respaldo, conservación y eliminación de fichas clínicas |
| Ley 21.430 | vigente | privacidad, interés superior, autonomía progresiva y reserva reforzada de datos de niños, niñas y adolescentes |
| Ley 21.719 | entra en vigor el 2026-12-01 | nuevos principios, derechos, Agencia, seguridad, incidentes, transferencias internacionales, evaluación de impacto y sanciones |

Fuentes oficiales consultadas:

- Ley 19.628 vigente: https://www.bcn.cl/leychile/Navegar?idNorma=141599
- Ley 20.584: https://www.bcn.cl/leychile/Navegar?idNorma=1039348
- Decreto 41/2012: https://www.bcn.cl/leychile/navegar?idNorma=1046753
- Ley 21.430: https://www.bcn.cl/leychile/Navegar?idNorma=1173643
- Ley 21.719: https://www.bcn.cl/leychile/Navegar?idNorma=1209272
- Monografía de Ficha Clínica 2025, Superintendencia de Salud: https://www.superdesalud.gob.cl/app/uploads/2025/12/monografia-ficha-clinica-2025-3.pdf
- Checklist de producción Supabase: https://supabase.com/docs/guides/deployment/going-into-prod
- Modelo de responsabilidad compartida Supabase: https://supabase.com/docs/guides/deployment/shared-responsibility-model
- DPA Supabase: https://supabase.com/downloads/docs/Supabase%2BDPA%2B260601.pdf

## Clasificación funcional

| Información | Clasificación mínima | Regla |
| --- | --- | --- |
| identidad, contacto, fecha de nacimiento | personal | minimización y acceso por necesidad |
| diagnósticos, evaluaciones, tratamientos, notas y sesiones | sensible de salud; potencial ficha clínica | controles clínicos completos y conservación legal |
| datos de tutores y hermanos | datos personales de terceros | finalidad y base de licitud propias; no asumir que el consentimiento del paciente los cubre |
| datos de menores | categoría especialmente protegida desde 2026-12-01 | interés superior, autonomía progresiva y consentimiento/representación verificable |
| iniciales o ID clínico reversible | seudonimizado, no anónimo | se protege como dato personal |
| conjunto sintético sin correspondencia con personas | no personal | único permitido en staging |
| conjunto anonimizado irreversible | fuera del ámbito personal sólo si no existe reidentificación razonable | requiere método, prueba y aprobación documentados |

## ¿Registro administrativo o ficha clínica?

La clasificación depende del contenido y de la finalidad, no del nombre de la aplicación.

- Un directorio mínimo de usuarios/pacientes, agenda o gestión administrativa no debe contener notas, diagnóstico ni tratamiento.
- Cuando el sistema registra antecedentes necesarios para otorgar atención de salud, evaluaciones, diagnósticos, procedimientos o tratamientos, debe diseñarse y operarse como ficha clínica.
- La ficha clínica electrónica debe ser única, íntegra, disponible, auténtica y confidencial; debe registrar quién accedió y cuándo.
- ABA Data Hub no se declara ficha clínica oficial hasta que un prestador responsable y una revisión jurídica/técnica confirmen que cumple Ley 20.584, Decreto 41 y los estándares MINSAL aplicables.

## Principios que se adoptan desde ahora

Aunque parte de la Ley 21.719 aún tenga vigencia diferida, el diseño se alinea desde ahora con:

1. licitud y lealtad;
2. finalidad específica;
3. proporcionalidad y minimización;
4. calidad y actualización;
5. responsabilidad demostrable;
6. seguridad basada en riesgo;
7. transparencia e información;
8. confidencialidad permanente;
9. protección desde el diseño y por defecto.

## Obligaciones operativas mínimas

### Responsable y encargados

- Identificar por razón social/RUT al responsable del tratamiento y al prestador custodio de la ficha.
- Definir por contrato las instrucciones, confidencialidad, subencargados, ubicación, incidentes, devolución/supresión y auditoría de cada proveedor.
- Tratar a Supabase, al proveedor del frontend, al correo transaccional, soporte y observabilidad como posibles encargados/subencargados según su función.
- Mantener inventario de tratamientos, proveedores, finalidades, categorías, titulares, ubicación, retención y controles.

### Licitud, información y consentimiento

- Mantener un registro de base de licitud por finalidad; no utilizar un consentimiento global.
- Separar consentimiento para atención, tratamiento de datos, comunicaciones, investigación y pruebas del producto.
- Conservar versión del aviso, texto aceptado, identidad/capacidad de quien autoriza, fecha, finalidad y mecanismo de revocación.
- No condicionar un servicio a datos innecesarios.
- Presentar información comprensible y permanente; para menores, adaptar el lenguaje a edad y madurez.

### Niños, niñas y adolescentes

- Verificar identidad y facultad del padre, representante o cuidador antes de habilitar tratamiento cuando corresponda.
- Registrar que el menor fue informado y oído conforme a su edad, madurez y autonomía progresiva.
- Desde 2026-12-01, el tratamiento de datos sensibles de adolescentes menores de 16 años requiere consentimiento de padre, representante o cuidador, salvo autorización legal expresa.
- El acceso familiar no es automático: debe derivarse de representación, autorización o regla legal documentada.

### Acceso y confidencialidad

- Autorizar por paciente y relación asistencial, no sólo por pertenencia a una organización.
- Aplicar mínimo privilegio, separación de funciones, MFA, sesiones limitadas y revocación inmediata al terminar la relación laboral/asistencial.
- Registrar lectura, creación, modificación, exportación, impresión, cesión, cambio de consentimiento y administración de permisos, sin copiar el contenido clínico al log.
- Impedir el acceso de personal clínico o administrativo no relacionado directamente con la atención.
- Definir un procedimiento excepcional de emergencia (`break glass`) con motivo, duración, alerta y revisión posterior.

### Derechos del titular

- Proveer canales autenticados para acceso, rectificación, supresión cuando proceda, oposición, bloqueo y portabilidad.
- Entregar copia íntegra gratuitamente, sin dilaciones indebidas, en formato estructurado, común y legible, conforme a Ley 20.584.
- Preparar el SLA de 30 días corridos de la Ley 21.719 y conservar prueba íntegra de cada respuesta.
- Resolver conflictos entre supresión y conservación clínica mediante un flujo jurídico; no prometer eliminación automática de una ficha que deba conservarse.

### Conservación y eliminación

- Conservar fichas clínicas al menos 15 años desde el último ingreso de información.
- Mantener un calendario por categoría y fundamento; los datos administrativos o de pruebas no heredan automáticamente 15 años.
- Tras el plazo aplicable, ejecutar eliminación efectiva, confidencial, trazable y autorizada. El Decreto 41 exige acta y, para prestadores privados, protocolización notarial.
- La regla de ingeniería "no borrar" se mantiene para el workspace y staging durante el desarrollo, pero debe ser reemplazada en producción por conservación legal y eliminación gobernada.

### Seguridad, continuidad e incidentes

- Cifrado en tránsito y reposo; evaluar cifrado a nivel de aplicación para identificadores y contenido clínico con gestión separada de claves.
- Respaldar cada incorporación y disponer de copias segregadas, control de acceso, restauración probada, RPO/RTO aprobados e inventario de restauraciones.
- Verificar periódicamente confidencialidad, integridad, disponibilidad y resiliencia.
- Mantener plan de respuesta, clasificación, preservación de evidencia, contención, recuperación y comunicación.
- Desde 2026-12-01, reportar sin dilaciones indebidas a la Agencia las vulneraciones con riesgo razonable; incorporar notificación a titulares y otras autoridades cuando la ley o el caso lo exijan.

### Transferencia internacional

El proyecto Supabase de staging usa AWS `sa-east-1`, São Paulo, Brasil. Antes de datos reales se debe:

1. documentar qué datos y metadatos salen de Chile;
2. revisar el DPA, subencargados y medidas de Supabase y del hosting;
3. definir el mecanismo de transferencia aplicable bajo los artículos 27 y 28 de la Ley 21.719;
4. informar ubicación y transferencias en el aviso de privacidad;
5. obtener revisión jurídica del mecanismo y garantías;
6. impedir nuevas regiones, réplicas, logs o integraciones no aprobadas.

### Evaluación de impacto y cumplimiento

- Completar una evaluación de impacto antes del primer dato real por involucrar salud, menores y seguimiento longitudinal.
- Designar un responsable interno de privacidad; evaluar un delegado de protección de datos y un modelo de prevención certificable.
- Mantener matriz de riesgos, capacitación, acuerdos de confidencialidad, revisiones de acceso y evidencia de controles.
- Revisar esta línea base cuando la Agencia publique reglamentos, listas de evaluaciones de impacto, países adecuados y cláusulas modelo.

## Riesgos sancionatorios desde 2026-12-01

La Ley 21.719 contempla multas de hasta 5.000 UTM para infracciones leves, 10.000 UTM para graves y 20.000 UTM para gravísimas; la reincidencia puede elevarlas y ciertas empresas pueden quedar expuestas a porcentajes de ingresos. También contempla registro público de sanciones y suspensión de operaciones de tratamiento en supuestos reiterados.

## Dictámenes pendientes para un abogado chileno

1. Identidad y calidad jurídica exacta del responsable y del prestador custodio.
2. Si cada módulo constituye ficha clínica o registro administrativo.
3. Base de licitud y texto de consentimiento por finalidad, incluyendo datos históricos.
4. Reglas de representación, acceso y autonomía progresiva para menores.
5. Mecanismo de transferencia internacional a Brasil y contratos con encargados.
6. Aplicación de Ley 21.663 de Ciberseguridad según actividad y eventual calificación del operador.
7. Requisitos de certificación/interoperabilidad MINSAL aplicables al producto.
8. Calendario de conservación y procedimiento notarial de eliminación.

