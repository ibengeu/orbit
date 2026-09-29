alter table orbit_messages
  add column if not exists pinned boolean not null default false;
