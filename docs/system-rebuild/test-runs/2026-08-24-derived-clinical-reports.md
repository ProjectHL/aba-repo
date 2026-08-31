# Test run — informes clínicos derivados

Fecha: 2026-08-24  
Proyecto remoto previsto: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Datos: exclusivamente sintéticos

## Alcance

- Selección de un cliente activo y rango de fechas inclusivo.
- Lectura tipada de sesiones, mediciones conductuales y ensayos de adquisición.
- Series temporales por plan y porcentaje correcto acumulado por meta.
- Estados de carga, vacío, error recuperable y reintento.
- Resumen imprimible que limita sus datos a iniciales, ID clínico, rango y métricas derivadas.

## Ciclo TDD

1. Se añadieron pruebas que fallaban por ausencia de agregador, repositorio y contexto de informes.
2. Se implementó el repositorio de sólo lectura y validación Zod de cada respuesta.
3. Se añadió un agregador puro que rechaza filas de otro cliente y no inventa porcentajes sin ensayos.
4. Se reemplazó la cartografía estática por una vista conectada a registros existentes.
5. Se corrigió una advertencia de ESLint sobre actualización síncrona de estado dentro de un efecto.

## Resultados

| Gate | Resultado |
| --- | --- |
| Pruebas específicas de informes | PASS — 6/6 |
| Regresión frontend completa | PASS — 79/79 |
| TypeScript | PASS |
| ESLint | PASS |
| Esquema remoto | Sin cambios; no requiere migración ni nuevos grants |

No se ejecutó `vite build`: reemplaza el contenido de `dist` y contradice la regla de no borrado.
La regresión proporcional se cubrió con pruebas, TypeScript y ESLint.

## Garantías verificadas

- El filtro de cliente está presente en las tres consultas y RLS continúa siendo el límite remoto.
- El agregador falla de forma segura si recibe una fila con otro `client_id`.
- Sólo se incluyen sesiones no archivadas dentro del rango seleccionado.
- El porcentaje se calcula como `correctos / (correctos + incorrectos)` y se muestra como
  `Sin ensayos` cuando el denominador es cero.
- No se creó tabla, RPC, caché ni archivo de informe con datos clínicos.
