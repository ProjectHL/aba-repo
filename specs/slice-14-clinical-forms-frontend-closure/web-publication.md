# Slice 14 / Publicación web

## Estado

Spec de implementación local. No autoriza Sites ni otra publicación.

## Gates de candidato

- Build en una carpeta nueva `apps/web/verification/release-YYYYMMDD-clinical-forms-cfXX/`.
- Nunca escribir o vaciar `dist` ni reutilizar un candidato existente.
- Preflight conserva noindex, no-store, CSP, HSTS, SPA fallback y configuración staging.
- No debe aparecer service role, JWT, correo/RUT sintético de tests ni payload de formularios en
  artefactos estáticos.
- Aumento JS inicial >10% abre P2; preferir carga dinámica para formularios grandes.
- Smoke local en 320, 768 y 1440 px; teclado y foco de diálogos.
- Frontend draft se pierde al recargar también en el build; esta pérdida debe ser visible.

Comandos autoritativos, siempre con binarios locales y carpeta nueva:

```powershell
.\node_modules\.bin\vitest.cmd run --reporter=dot
.\node_modules\.bin\tsc.cmd -b
.\node_modules\.bin\eslint.cmd .
.\node_modules\.bin\vite.cmd build --mode staging --outDir verification\release-YYYYMMDD-clinical-forms-cfXX --emptyOutDir false
node scripts\verify-staging-build.mjs verification\release-YYYYMMDD-clinical-forms-cfXX
```

Pruebas adicionales espían `localStorage`, `sessionStorage`, IndexedDB, `fetch` y XHR durante drafts;
el candidato se inspecciona con `rg` para `service_role`, JWT largos, emails/RUT de fixtures y textos
de payload. El smoke de reload/viewport/teclado se documenta en QA final; no se simula con jsdom.

## Publicación futura

Después de CF-08, QA final debe recorrer todo con fixtures sintéticos. Publicar requiere una decisión
separada con URL, audiencia, Redirect URLs y responsable. Esta spec no habilita datos reales.
