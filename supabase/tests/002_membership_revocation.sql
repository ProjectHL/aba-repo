-- Slice 05: reversible membership access control.
-- Run after migration 005. The script raises on any failed invariant.

do $$
declare
  v_nullable text;
  v_default text;
  v_invalid_statuses bigint;
  v_unprotected_policies bigint;
  v_function_definition text;
  v_trigger_count bigint;
  v_delete_policy_count bigint;
begin
  select c.is_nullable, c.column_default
    into v_nullable, v_default
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'memberships'
    and c.column_name = 'status';

  if v_nullable is null then
    raise exception 'memberships.status is missing';
  end if;

  if v_nullable <> 'NO' then
    raise exception 'memberships.status must be NOT NULL';
  end if;

  if coalesce(v_default, '') not like '%active%' then
    raise exception 'memberships.status must default to active';
  end if;

  select count(*) into v_invalid_statuses
  from public.memberships
  where status not in ('active', 'inactive');

  if v_invalid_statuses <> 0 then
    raise exception 'memberships contains invalid status values';
  end if;

  select count(*) into v_unprotected_policies
  from pg_policies p
  where p.schemaname = 'public'
    and p.tablename in ('organizations', 'clients', 'guardians', 'siblings')
    and lower(coalesce(p.qual, '') || ' ' || coalesce(p.with_check, '')) like '%memberships%'
    and lower(coalesce(p.qual, '') || ' ' || coalesce(p.with_check, '')) not like '%status%active%';

  if v_unprotected_policies <> 0 then
    raise exception '% membership-based RLS policies do not require active status', v_unprotected_policies;
  end if;

  select pg_get_functiondef(p.oid) into v_function_definition
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'create_client'
  order by p.oid
  limit 1;

  if coalesce(lower(v_function_definition), '') not like '%status%active%' then
    raise exception 'create_client must require an active membership';
  end if;

  select count(*) into v_trigger_count
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = 'memberships'
    and t.tgname = 'audit_membership_status_change'
    and not t.tgisinternal;

  if v_trigger_count <> 1 then
    raise exception 'membership status audit trigger is missing';
  end if;

  select count(*) into v_delete_policy_count
  from pg_policies p
  where p.schemaname = 'public'
    and p.cmd = 'DELETE';

  if v_delete_policy_count <> 0 then
    raise exception 'DELETE policies remain forbidden';
  end if;
end;
$$;

select 'membership_revocation_invariants' as test_suite, 'pass' as result;
