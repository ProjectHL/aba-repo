# Slice 08 / Cartografía frontend navegable

## Objetivo

Dejar de presentar la base de acceso como MVP y construir el mapa visual navegable del producto
observado: ficha del cliente, evaluación, adquisición, reducción, sesiones e informes.

## Clasificación

Esta slice entrega vistas y navegación. No afirma persistencia clínica ni generación real de reportes.
Cada superficie debe indicar qué está conectado y qué se implementará en la siguiente slice funcional.

## Estado al 2026-08-18

**Implementada y publicada como cartografía visual.**

- Navegación del expediente: Información, Evaluación conductual, Programas de adquisición,
  Reducción de conductas y Sesiones.
- Formularios de referencia identificados explícitamente como no persistentes.
- Simulación local de captura de sesión sin guardado.
- Vista global de Informes y progreso sin cálculos ni exportación real.
- Sites versión 10 privada publicada desde el commit `32d59743f8f80e87ccc89d59038d963ebac38ec6`.

La siguiente slice debe convertir una sola de estas áreas en flujo vertical funcional, empezando por
Evaluación conductual. Esta slice no autoriza datos reales.
