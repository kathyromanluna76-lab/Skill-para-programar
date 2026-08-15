# Reglas del proyecto: Conecta Proposal

Herramienta web para generar propuestas comerciales de consultoría de Conecta Consulting. Dueña del proyecto: Kathy Román Luna, CEO. Convierte una conversación comercial en una propuesta lista para enviar en menos de 30 minutos.

## Decisiones fijas, no reabrir sin que Kathy lo pida

1. La IA nunca genera cifras. Honorarios, plazos y porcentajes entran solo por formulario y se insertan después de la generación.
2. Honorarios por fase, no monto único. Conecta factura por avance de fase.
3. Nunca usar el guion largo en ningún texto de la aplicación ni de las propuestas generadas. Reemplazar por comas, puntos, dos puntos o punto y coma.
4. Sin login de usuarios. Un solo código de acceso compartido protege toda la aplicación (variable de entorno `APP_ACCESS_CODE`).
5. Presupuesto: mantenerse en los planes gratuitos de Supabase y Vercel. No agregar servicios pagos sin confirmarlo con Kathy primero.
6. La llamada a la API de Claude vive solo en el servidor (`lib/ia.js`, ruta `/api/generar`). La llave `ANTHROPIC_API_KEY` nunca debe llegar al navegador.
7. Los datos se guardan en Supabase, tabla `kv_store`, con RLS activado y sin reglas para `anon`/`authenticated`: solo el servidor (llave de servicio) puede leer o escribir.

## Tecnología

Next.js (App Router) + React, sin librería de estilos externa (CSS propio en `app/globals.css`, portado del prototipo). Base de datos: Supabase (Postgres). Hosting: Vercel. Redacción con Claude, modelo por defecto `claude-sonnet-5` (configurable con `ANTHROPIC_MODEL`). Exportación a PDF con `html2pdf.js`, con `window.print()` como respaldo.

## Estructura

- `app/conecta/app.js`: toda la lógica de la pantalla (wizard, vista previa, ajustes), portada casi literal del prototipo `conecta-proposal.html`. Sigue el mismo patrón de estado único en memoria que se vuelve a dibujar completo en cada cambio.
- `lib/catalog.js`: datos base (servicios, biblioteca de metodologías, secciones del documento). Se usa tanto en el cliente como en el servidor.
- `lib/ia.js`: reglas de redacción y llamada a la API de Claude. Solo servidor.
- `lib/supabaseAdmin.js`, `lib/kv.js`: acceso a la base de datos. Solo servidor.
- `lib/session.js`, `middleware.js`: código de acceso y protección de rutas.
- `supabase/schema.sql`: crear la tabla y dejar las reglas de acceso listas antes de usar la aplicación.

## Fuera de alcance actual

Firma digital, CRM, facturación, pasarela de pagos, envío automático por correo, aprobación electrónica del cliente, gestión de usuarios y permisos, integración con ERP, dashboard de ventas, exportación a Word.

## Pendientes conocidos

1. Ambiente de prueba (staging): todavía no está armado. Ver sección de arnés en la conversación con Tidú.
2. Revisión de seguridad: pendiente de correr `/security-review` antes de considerar el proyecto cerrado.
3. Completar la biblioteca de servicios con los once tipos restantes (hoy solo Optimización de almacenes, S&OP / IBP y Rediseño de procesos tienen biblioteca).
4. Evaluar exportación a PPT como formato alternativo al PDF.
