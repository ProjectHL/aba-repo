-- Slice 09 / Lote 04: atomic clinical session contract.
-- Read-only metadata assertions plus rejected calls that cannot persist rows.

do $$
declare
  v_function_oid oid;
  v_security_definer boolean;
  v_public_execute boolean;
  v_anon_execute boolean;
  v_authenticated_execute boolean;
begin
  select p.oid, p.prosecdef
    into v_function_oid, v_security_definer
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'create_clinical_session'
  order by p.oid
  limit 1;

  if v_function_oid is null then
    raise exception 'create_clinical_session is missing';
  end if;

  if v_security_definer then
    raise exception 'create_clinical_session must remain security invoker';
  end if;

  select has_function_privilege('public', v_function_oid, 'EXECUTE'),
         has_function_privilege('anon', v_function_oid, 'EXECUTE'),
         has_function_privilege('authenticated', v_function_oid, 'EXECUTE')
    into v_public_execute, v_anon_execute, v_authenticated_execute;

  if v_public_execute or v_anon_execute or not v_authenticated_execute then
    raise exception 'unexpected execute grants: public %, anon %, authenticated %',
      v_public_execute, v_anon_execute, v_authenticated_execute;
  end if;

  begin
    perform public.create_clinical_session(
      gen_random_uuid(), current_date, 'fixture sintético', '[]'::jsonb, '[]'::jsonb, gen_random_uuid()
    );
    raise exception 'empty clinical session payload was accepted';
  exception
    when sqlstate '22023' then null;
  end;

  begin
    perform public.create_clinical_session(
      gen_random_uuid(), current_date, 'fixture sintético', '{}'::jsonb, '[]'::jsonb, gen_random_uuid()
    );
    raise exception 'non-array clinical session payload was accepted';
  exception
    when sqlstate '22023' then null;
  end;
end;
$$;

select 'atomic_clinical_session_contract' as test_suite, 'pass' as result;

