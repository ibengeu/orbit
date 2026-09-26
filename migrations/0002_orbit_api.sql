create table if not exists orbit_workspaces (
  owner_id text not null,
  id text not null,
  name text not null,
  initials text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id, id)
);

create unique index if not exists orbit_workspaces_owner_name_idx
  on orbit_workspaces (owner_id, lower(name));

create table if not exists orbit_conversations (
  owner_id text not null,
  id text not null,
  workspace_id text not null,
  kind text not null check (kind in ('channel', 'dm')),
  name text,
  description text,
  participant_ids jsonb not null default '[]'::jsonb,
  title text,
  created_at timestamptz not null default now(),
  primary key (owner_id, id),
  foreign key (owner_id, workspace_id) references orbit_workspaces(owner_id, id) on delete cascade
);

create unique index if not exists orbit_conversations_channel_name_idx
  on orbit_conversations (owner_id, workspace_id, lower(name)) where kind = 'channel';

create table if not exists orbit_messages (
  owner_id text not null,
  id text not null,
  conversation_id text not null,
  author_id text not null,
  body text not null,
  parent_id text,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  version integer not null default 1,
  primary key (owner_id, id),
  foreign key (owner_id, conversation_id) references orbit_conversations(owner_id, id) on delete cascade
);

create index if not exists orbit_messages_conversation_idx
  on orbit_messages (owner_id, conversation_id, created_at desc);

create table if not exists orbit_message_attachments (
  owner_id text not null,
  id text not null,
  message_id text not null,
  name text not null,
  media_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  content bytea not null,
  primary key (owner_id, id),
  foreign key (owner_id, message_id) references orbit_messages(owner_id, id) on delete cascade
);

create index if not exists orbit_message_attachments_message_idx
  on orbit_message_attachments (owner_id, message_id);

create table if not exists orbit_reactions (
  owner_id text not null,
  message_id text not null,
  user_id text not null,
  emoji text not null,
  created_at timestamptz not null default now(),
  primary key (owner_id, message_id, user_id, emoji),
  foreign key (owner_id, message_id) references orbit_messages(owner_id, id) on delete cascade
);

create table if not exists orbit_saved_messages (
  owner_id text not null,
  message_id text not null,
  saved_at timestamptz not null default now(),
  primary key (owner_id, message_id),
  foreign key (owner_id, message_id) references orbit_messages(owner_id, id) on delete cascade
);

create table if not exists orbit_read_states (
  owner_id text not null,
  conversation_id text not null,
  last_read_at timestamptz not null,
  primary key (owner_id, conversation_id),
  foreign key (owner_id, conversation_id) references orbit_conversations(owner_id, id) on delete cascade
);

create table if not exists orbit_profiles (
  owner_id text primary key,
  presence text not null default 'online' check (presence in ('online', 'away', 'offline')),
  status text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists orbit_preferences (
  owner_id text primary key,
  always_show_time boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists orbit_calls (
  owner_id text not null,
  id text not null,
  conversation_id text not null,
  kind text not null check (kind in ('voice', 'video')),
  status text not null check (status in ('lobby', 'active', 'ended')),
  started_at timestamptz,
  ended_at timestamptz,
  duration_sec integer,
  primary key (owner_id, id),
  foreign key (owner_id, conversation_id) references orbit_conversations(owner_id, id) on delete cascade
);
