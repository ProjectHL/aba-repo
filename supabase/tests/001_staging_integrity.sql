do $$
declare
  missing_tables integer;
  rls_disabled integer;
  delete_policies integer;
  orphan_relations integer;
  untagged_clients integer;
  clients_without_create_audit integer;
begin
  select count(*) into missing_tables
  from unnest(array['organizations','memberships','clients','guardians','siblings','audit_events']) expected(name)
  where not exists (
    select 1 from pg_tables t where t.schemaname = 'public' and t.tablename = expected.name
  );

  select count(*) into rls_disabled
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relname = any(array['organizations','memberships','clients','guardians','siblings','audit_events'])
    and not c.relrowsecurity;

  select count(*) into delete_policies
  from pg_policies
  where schemaname = 'public' and cmd = 'DELETE';

  select
    (select count(*) from public.guardians g left join public.clients c on c.id = g.client_id where c.id is null) +
    (select count(*) from public.siblings s left join public.clients c on c.id = s.client_id where c.id is null) +
    (select count(*) from public.audit_events a left join public.clients c on c.id = a.entity_id where a.entity_type = 'client' and c.id is null)
  into orphan_relations;

  select count(*) into untagged_clients
  from public.clients where test_run_id is null;

  select count(*) into clients_without_create_audit
  from public.clients c
  where not exists (
    select 1 from public.audit_events a
    where a.entity_id = c.id and a.entity_type = 'client' and a.action = 'created'
  );

  if missing_tables <> 0 then raise exception 'qa_missing_tables:%', missing_tables; end if;
  if rls_disabled <> 0 then raise exception 'qa_rls_disabled:%', rls_disabled; end if;
  if delete_policies <> 0 then raise exception 'qa_delete_policies:%', delete_policies; end if;
  if orphan_relations <> 0 then raise exception 'qa_orphans:%', orphan_relations; end if;
  if untagged_clients <> 0 then raise exception 'qa_untagged_clients:%', untagged_clients; end if;
  if clients_without_create_audit <> 0 then raise exception 'qa_missing_create_audit:%', clients_without_create_audit; end if;
end;
$$;

select jsonb_build_object(
  'status', 'pass',
  'clients', (select count(*) from public.clients),
  'archived_clients', (select count(*) from public.clients where status = 'archived'),
  'audit_events', (select count(*) from public.audit_events),
  'memberships', (select count(*) from public.memberships)
) as staging_integrity;
