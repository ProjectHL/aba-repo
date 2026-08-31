-- Structural and read-only contract checks for S-ABA-01 + S-ABA-02.
do $$
declare
  missing_tables text[];
begin
  select array_agg(expected.name order by expected.name)
  into missing_tables
  from unnest(array[
    'student_assignments',
    'student_authorization_requests',
    'student_authorization_decisions',
    'client_context_profiles',
    'clinical_history_entries',
    'consent_records',
    'consent_events',
    'student_access_audit_events'
  ]) expected(name)
  where to_regclass('public.' || expected.name) is null;
  if missing_tables is not null then
    raise exception 'missing S-ABA tables: %', missing_tables;
  end if;
end $$;

do $$
declare
  rls_count integer;
  delete_policy_count integer;
begin
  select count(*) into rls_count
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = any(array[
      'student_assignments', 'student_authorization_requests',
      'student_authorization_decisions', 'client_context_profiles',
      'clinical_history_entries', 'consent_records', 'consent_events',
      'student_access_audit_events'
    ])
    and c.relrowsecurity;
  if rls_count <> 8 then raise exception 'all S-ABA tables must enable RLS'; end if;

  select count(*) into delete_policy_count
  from pg_policies
  where schemaname = 'public'
    and tablename = any(array[
      'student_assignments', 'student_authorization_requests',
      'student_authorization_decisions', 'client_context_profiles',
      'clinical_history_entries', 'consent_records', 'consent_events',
      'student_access_audit_events'
    ])
    and cmd in ('DELETE', 'ALL');
  if delete_policy_count <> 0 then raise exception 'S-ABA tables must not expose DELETE policies'; end if;
end $$;

do $$
declare
  direct_delete_grants integer;
  exposed_functions integer;
begin
  select count(*) into direct_delete_grants
  from information_schema.role_table_grants
  where table_schema = 'public'
    and table_name = any(array[
      'student_assignments', 'student_authorization_requests',
      'student_authorization_decisions', 'client_context_profiles',
      'clinical_history_entries', 'consent_records', 'consent_events',
      'student_access_audit_events'
    ])
    and grantee in ('anon', 'authenticated')
    and privilege_type = 'DELETE';
  if direct_delete_grants <> 0 then raise exception 'S-ABA tables must not grant DELETE'; end if;

  select count(*) into exposed_functions
  from information_schema.routine_privileges
  where specific_schema = 'public'
    and routine_name = any(array[
      'request_student_authorization', 'decide_student_authorization',
      'revoke_student_authorization', 'set_student_assignment',
      'save_client_context', 'append_clinical_history_entry',
      'append_clinical_history_entries',
      'record_consent_reference', 'get_student_capabilities'
    ])
    and grantee in ('PUBLIC', 'anon');
  if exposed_functions <> 0 then raise exception 'privileged S-ABA functions exposed to public/anon'; end if;
end $$;

do $$
declare
  v_user_id uuid;
  v_client_id uuid;
  allowed boolean;
begin
  select sa.user_id, sa.client_id into v_user_id, v_client_id
  from public.student_assignments sa
  where sa.status = 'active'
  order by sa.created_at
  limit 1;
  if v_user_id is null then raise exception 'legacy mapping created no synthetic assignment'; end if;
  perform set_config('request.jwt.claim.sub', v_user_id::text, true);
  select private.has_student_capability(v_client_id, 'student.view') into allowed;
  if not allowed then raise exception 'mapped assignment cannot view its assigned student'; end if;
  perform set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
  select private.has_student_capability(v_client_id, 'student.view') into allowed;
  if allowed then raise exception 'unassigned synthetic identity gained student access'; end if;
end $$;
