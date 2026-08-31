-- Slice 13A: read-only metadata checks and rejected payloads only.

do $$
declare
  v_nullable text;
  v_security_definer boolean;
begin
  select is_nullable into v_nullable
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'session_behavior_measurements'
    and column_name = 'measurement_unit';

  if v_nullable <> 'YES' then
    raise exception 'measurement_unit must remain nullable for legacy rows';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'session_behavior_measurements'
      and column_name in ('interval_observed', 'interval_total')
    group by table_schema, table_name
    having count(*) = 2
  ) then
    raise exception 'interval dimension columns are missing';
  end if;

  select p.prosecdef into v_security_definer
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'create_clinical_session'
  order by p.oid
  limit 1;

  if v_security_definer then
    raise exception 'create_clinical_session must remain security invoker';
  end if;

  begin
    perform public.create_clinical_session(
      gen_random_uuid(),
      current_date,
      'fixture sintético',
      '[{"behavior_plan_id":"11111111-1111-4111-8111-111111111111","measurement_unit":"interval","observed":2,"total":1}]'::jsonb,
      '[]'::jsonb,
      gen_random_uuid()
    );
    raise exception 'observed greater than total was accepted';
  exception
    when sqlstate '22023' then null;
  end;
end;
$$;

select 'session_measurement_dimensions_contract' as test_suite, 'pass' as result;
