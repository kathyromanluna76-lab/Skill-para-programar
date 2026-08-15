# Conecta Proposal

Generador de propuestas comerciales de Conecta Consulting. Versión real (Fase 1) del prototipo `conecta-proposal.html`, construida en Next.js.

Ver `CLAUDE.md` para las decisiones fijas del proyecto y `supabase/schema.sql` para la base de datos.

## Desarrollo local

1. Copia `.env.example` a `.env.local` y completa los valores (código de acceso, credenciales de Supabase, llave de la API de Claude).
2. `npm install`
3. `npm run dev`
4. Abre `http://localhost:3000`

## Desplegar

1. Crea el proyecto en [Supabase](https://supabase.com) y corre `supabase/schema.sql` en su editor SQL.
2. Crea el proyecto en [Vercel](https://vercel.com), conectado a este repositorio, con la carpeta `conecta-proposal` como raíz.
3. Carga las mismas variables de `.env.example` como variables de entorno en Vercel.
4. Despliega.
