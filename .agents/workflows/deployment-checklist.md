---
description: Preparación de la Aplicación para Publicación (De Local a Producción)
---

# 🚀 Regla de Oro Global: Preparar la App para Publicar

*Este workflow define los pasos OBLIGATORIOS y la lista de chequeo (check-list) exhaustiva que se debe seguir CADA VEZ que se solicita "preparar una app para publicar" o "subir a producción". Su objetivo es evitar dar vueltas innecesarias, verificar la integridad del código, establecer todas las claves correctas y desplegar correctamente sin fallos.*

## 📋 FASE 1: Revisión y Limpieza del Código Local

Antes de tocar cualquier servidor, la aplicación debe estar lista a nivel de archivos.

- [ ] **Limpiar Logs y Mocks:** Retirar `console.log()` de la lógica crítica, datos mockeados innecesarios y comentarios como "Para desarrollo".
- [ ] **URLs Relativas y Absolutas:** Asegurarse de que el frontend usa URLs dinámicas que apunten al entorno adecuado (ej. `process.env.VITE_API_URL` o `import.meta.env.VITE_API_URL` apuntando a Vercel en la nube y NO a `http://localhost:3000`).
- [ ] **Verificación de UI Responsiva:** Corroborar que toda UI (incluyendo modals emergentes) sea responsive (adaptable a móvil/escritorio).
- [ ] **Supresión de Errores Vistos:** Solventar cualquier error o "warning" gordo en la consola del navegador o al compilar, especialmente aquellos que frenan el Build de Vite o React.
- [ ] **Rutas y Assets:** Verificar que imágenes locales y rutas del `react-router` cargan correctamente sobre la carpeta base `/`.

## 🔒 FASE 2: Gestión de Variables de Entorno (.env)

Este paso es **crítico**. Las variables locales no funcionan en la web/nube.

- [ ] **Cambio a Claves de Producción:** Asegurar que estamos usando las Keys definitivas y oficiales, y no entorno "Test", para:
  - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Reales del proyecto en producción).
  - `GEMINI_API_KEY` (Llave de pago/producción facturada, validando modelo `gemini-2.5-flash`).
  - `STRIPE_SECRET_KEY` o Webhooks facturables (si aplica, quitando prefijos `sk_test` por `sk_live`).
  - `VITE_API_URL` (Debe ser el enlace oficial de la API backend de la app, por ejemplo: `https://[mi-app-backend].vercel.app`).
- [ ] **Actualizar Vercel Enviroment:** Recordar que hay que inyectar estas claves obligatoriamente en el panel Dashboard Settings de Vercel para que las lea en el servidor. Nunca hay que subir el archivo `.env` al repositorio Git por seguridad.

## 🗄️ FASE 3: Backend, Supabase, APIs & Consistencia de IA

Toda función remota y lógica inteligente debe ser accesible en web exactamente igual que en local.

- [ ] **Configuración Inteligente de IA (Persistencia):** Garantizar que si se ha configurado un modelo de IA específico que ha sido testeado y funciona bien en local (ej. `gemini-2.5-flash`), sus guardrails de llamadas, prompts base y parseos estén exactamente replicados en el backend de producción. **Nada de "fallbacks" o downgrades de modelos para la nube por defecto.** ¡Lo que funciona en local, se clona en público al 100%!
- [ ] **CORS en el Backend / Vercel Configuration (`vercel.json`):** Asegurar que las cabeceras `'Access-Control-Allow-Origin', '*'` (o enlace de app específico) están explícitas para evitar bloqueos del navegador CORS.  
- [ ] **Supabase Roles y Políticas (RLS):** Verificar que las tablas que se usarán tienen Row Level Security activadas correctamente.
- [ ] **Autenticación Redirects:** Modificar y validar los URLs autorizados en Authentication > URL Configuration en Supabase. El "Site URL" y los "Redirect URLs" (`https://[myapp].vercel.app`) deben estar configurados.
- [ ] **Stripe Webhooks (si aplica):** Actualizar en el Panel de Stripe la nueva URL de Vercel como destino del Event Webhook.

## 🐙 FASE 4: Actualización en Git (Control de Versiones)

- [ ] Ejecutar status y confirmaciones:

```bash
git add .
git commit -m "chore(deploy): preparacion para produccion y actualizacion de variables"
git push origin main
```

- [ ] Verificar que todo este `Up-to-date`. Git ejerce como único puente oficial hacia Vercel/Producción.

## ☁️ FASE 5: Vercel Deploy y Testing de Producción

El último paso y revisión general final.

- [ ] **Forzar Re-Deployment:** En Vercel, al haber subido cambios al repositorio Git, normalmente se genera un Auto-Deploy. Sin embargo, si hemos tocado variables en el Panel Web de Vercel (Fase 2), DEBEMOS lanzar un Re-deploy manual desde ese mismo menú Deployment en Vercel.
- [ ] **Testeo Exhaustivo:** Una vez levantada, DEBEMOS comprobar manualmente en el enlace `.vercel.app`:
  1. ¿Carga el Landing? (HTML + CSS resuelven bien).
  2. ¿El Autenticador / Inicio Sesión funciona y redirecciona a `dashboard` o `app`?
  3. ¿Las llamadas a API externas (ej. llamadas a Gemini o Stripe) procesan el pago / devuelven resultados de Inteligencia Artificial bien o dan Fallo CORS/Error 500?

### 👑 RESUMEN DIRECTO 👑

1. **Local Clean-up** (quitar Localhost del código y purgar mocks y fallos).
2. **Entornos/Enviroments** (Mudar claves Test a Live y configurar panel de Vercel Envs).
3. **Plataformas Externas** (Configurar Redirect Urls en Supabase RLS/Auth y Webhooks en Stripe).
4. **Git Push** (Subir estado íntegro y estable al respositorio principal).
5. **Vercel Deploy + Testing** (Arrancar desde Vercel con todo cargado, y simular la ruta crítica completa del usuario como prueba final).
