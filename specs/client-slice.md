# Slice 01: Clientes

## Decisión de alcance

Implementar primero la experiencia frontend con repositorio simulado. No conectar Auth, NestJS ni Supabase hasta aprobar las preguntas de identidad, roles, consentimiento y campos obligatorios.

## Incluido

- Shell ABA Data Hub: cabecera, Clientes, Informes deshabilitado/placeholder y avatar sintético.
- `/clientes`: título, indicadores en cero, estado vacío/búsqueda y acción de alta.
- `/clientes/nuevo`: apariencia de diálogo/ruta, información básica, tutores, hermanos y convivencia.
- Cálculo de edad en años y meses.
- Adaptador en memoria con datos exclusivamente sintéticos.
- Componentes shadcn/ui mínimos: Button, Card, Dialog, Input, Label/Field, Select, Separator y ScrollArea.

## Diferido dentro de Clientes

- Adaptaciones, escolarización e historia clínica, aunque están observadas, para evitar un primer formulario demasiado amplio.
- Persistencia remota, login real, asignación de usuarios y consentimiento.
- Detalle funcional; se puede crear un placeholder trazado a S-04.

## Orden TDD

1. Prueba de edad con fechas límite.
2. Prueba de render de campos básicos.
3. Pruebas de agregar tutor/hermano preservando valores.
4. Prueba de accesibilidad por teclado y etiquetas.
5. Prueba del contrato de repositorio al enviar.
6. Prueba E2E del recorrido Clientes → Alta → placeholder de detalle con datos sintéticos.

## Aprobaciones todavía necesarias

- Reglas de obligatoriedad.
- Unicidad/formato del ID clínico.
- Guardado automático o explícito.
- Comportamiento de cancelar y destino posterior al alta.
