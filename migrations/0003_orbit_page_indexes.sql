create index if not exists orbit_messages_page_idx
  on orbit_messages (owner_id, conversation_id, created_at desc, id desc);

drop index if exists orbit_messages_conversation_idx;

create index if not exists orbit_calls_ended_page_idx
  on orbit_calls (owner_id, ended_at desc, id desc)
  where status = 'ended' and started_at is not null;
