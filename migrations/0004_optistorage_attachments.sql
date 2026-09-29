alter table orbit_message_attachments
  add column if not exists object_key text;

alter table orbit_message_attachments
  alter column content drop not null;

alter table orbit_message_attachments
  add constraint orbit_message_attachments_storage_location_check
  check ((content is null) <> (object_key is null));
