-- Structural/read-only contract checks for S-ABA-03.
do $$
declare
  missing_tables text[];
begin
  select array_agg(expected.name order by expected.name)
  into missing_tables
  from unnest(array['programs', 'program_versions', 'program_lifecycle_events']) expected(name)
  where to_regclass('public.' || expected.name) is null;
  if missing_tables is not null then
    raise exception 'missing S-ABA-03 tables: %', missing_tables;
  end if;
end $$;

do $$
declare
  rls_count integer;
  delete_policy_count integer;
  delete_grant_count integer;
begin
  select count(*) into rls_count
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = any(array['programs', 'program_versions', 'program_lifecycle_events'])
    and c.relrowsecurity;
  if rls_count <> 3 then raise exception 'all S-ABA-03 tables must enable RLS'; end if;

  select count(*) into delete_policy_count from pg_policies
  where schemaname = 'public'
    and tablename = any(array['programs', 'program_versions', 'program_lifecycle_events'])
    and cmd in ('DELETE', 'ALL');
  if delete_policy_count <> 0 then raise exception 'S-ABA-03 must not expose DELETE policies'; end if;

  select count(*) into delete_grant_count from information_schema.role_table_grants
  where table_schema = 'public'
    and table_name = any(array['programs', 'program_versions', 'program_lifecycle_events'])
    and grantee in ('anon', 'authenticated') and privilege_type = 'DELETE';
  if delete_grant_count <> 0 then raise exception 'S-ABA-03 must not grant DELETE'; end if;
end $$;

do $$
declare
  exposed_functions integer;
begin
  select count(*) into exposed_functions
  from information_schema.routine_privileges
  where specific_schema = 'public'
    and routine_name = any(array[
      'create_program_draft', 'create_program_successor', 'transition_program'
    ])
    and grantee in ('PUBLIC', 'anon');
  if exposed_functions <> 0 then raise exception 'S-ABA-03 functions exposed to public/anon'; end if;
end $$;

do $$
begin
  if not private.program_design_is_complete('acquisition', jsonb_build_object(
    'kind', 'acquisition', 'goal', 'G', 'skillArea', 'A', 'antecedent', 'Antecedente',
    'steps', jsonb_build_array('Paso'), 'teachingProcedure', 'Procedimiento',
    'sets', jsonb_build_array(jsonb_build_object('name', 'Set', 'items', jsonb_build_array('Ítem'))),
    'promptLevels', jsonb_build_array('Independiente'), 'errorCorrection', 'Corrección',
    'masteryCriterion', 'Criterio'
  )) then raise exception 'complete acquisition design rejected'; end if;

  if private.program_design_is_complete('acquisition', jsonb_build_object(
    'kind', 'acquisition', 'goal', 'G', 'skillArea', 'A', 'antecedent', 'Antecedente',
    'steps', '[]'::jsonb, 'teachingProcedure', 'Procedimiento', 'sets', '[]'::jsonb,
    'promptLevels', '[]'::jsonb, 'errorCorrection', 'Corrección', 'masteryCriterion', 'Criterio'
  )) then raise exception 'incomplete acquisition design accepted'; end if;
end $$;

do $$
declare
  missing_indexes text[];
begin
  select array_agg(expected.name order by expected.name)
  into missing_indexes
  from unnest(array[
    'programs_organization_idx',
    'programs_current_version_idx',
    'programs_created_by_idx',
    'program_versions_organization_idx',
    'program_versions_program_client_type_idx',
    'program_versions_created_by_idx',
    'program_lifecycle_events_organization_idx',
    'program_lifecycle_events_version_idx',
    'program_lifecycle_events_actor_idx'
  ]) expected(name)
  where to_regclass('public.' || expected.name) is null;
  if missing_indexes is not null then
    raise exception 'missing S-ABA-03 foreign-key indexes: %', missing_indexes;
  end if;
end $$;
