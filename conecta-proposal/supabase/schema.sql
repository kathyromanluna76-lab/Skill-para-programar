-- Esquema de la base de datos de Conecta Proposal.
-- Crea una sola tabla, con dos filas fijas: una con todas tus propuestas
-- y otra con tus ajustes de firma. Así reutilizamos exactamente la misma
-- forma de datos que ya probaste en el prototipo.

create table if not exists kv_store (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Deja la puerta cerrada por defecto: con RLS activado y sin ninguna regla
-- para los roles "anon" ni "authenticated", nadie que entre con la llave
-- pública puede leer ni escribir nada. Solo el servidor de la aplicación,
-- que usa la llave de servicio, puede pasar (esa llave se salta RLS).
alter table kv_store enable row level security;

-- Filas iniciales, para que la aplicación tenga algo que leer desde el primer momento.
insert into kv_store (key, value) values ('props', '[]'::jsonb) on conflict (key) do nothing;
insert into kv_store (key, value) values ('set', '{}'::jsonb) on conflict (key) do nothing;
