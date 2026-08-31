-- Slice 09 / Lote 04: atomic clinical session capture.
-- Staging-only. The function runs as the caller so table RLS remains authoritative.

create or replace function public.create_clinical_session(
  p_client_id uuid,
  p_occurred_on date,
  p_notes text,
  p_behavior_measurements jsonb,
  p_acquisition_trials jsonb,
  p_test_run_id uuid
)
returns public.clinical_sessions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_session public.clinical_sessions;
  v_behavior_measurements jsonb := coalesce(p_behavior_measurements, '[]'::jsonb);
  v_acquisition_trials jsonb := coalesce(p_acquisition_trials, '[]'::jsonb);
begin
  if p_occurred_on is null or p_occurred_on > current_date then
    raise exception using errcode = '22023', message = 'invalid session date';
  end if;

  if jsonb_typeof(v_behavior_measurements) <> 'array'
     or jsonb_typeof(v_acquisition_trials) <> 'array' then
    raise exception using errcode = '22023', message = 'session collections must be arrays';
  end if;

  if jsonb_array_length(v_behavior_measurements) + jsonb_array_length(v_acquisition_trials) = 0 then
    raise exception using errcode = '22023', message = 'session requires at least one measurement or trial';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_behavior_measurements) as item
    where jsonb_typeof(item) <> 'object'
       or not (item ? 'behavior_plan_id')
       or not (item ? 'value')
  ) or exists (
    select 1
    from jsonb_array_elements(v_acquisition_trials) as item
    where jsonb_typeof(item) <> 'object'
       or not (item ? 'goal_id')
       or not (item ? 'correct')
       or not (item ? 'incorrect')
  ) then
    raise exception using errcode = '22023', message = 'invalid session collection item';
  end if;

  if (
    select count(*) <> count(distinct item ->> 'behavior_plan_id')
    from jsonb_array_elements(v_behavior_measurements) as item
  ) or (
    select count(*) <> count(distinct item ->> 'goal_id')
    from jsonb_array_elements(v_acquisition_trials) as item
  ) then
    raise exception using errcode = '22023', message = 'duplicate session target';
  end if;

  insert into public.clinical_sessions (
    client_id, occurred_on, status, notes, test_run_id
  ) values (
    p_client_id,
    p_occurred_on,
    'completed',
    nullif(btrim(p_notes), ''),
    p_test_run_id
  )
  returning * into v_session;

  insert into public.session_behavior_measurements (
    session_id, client_id, behavior_plan_id, value, test_run_id
  )
  select
    v_session.id,
    p_client_id,
    item.behavior_plan_id,
    item.value,
    p_test_run_id
  from jsonb_to_recordset(v_behavior_measurements)
    as item(behavior_plan_id uuid, value numeric);

  insert into public.session_acquisition_trials (
    session_id, client_id, goal_id, correct, incorrect, test_run_id
  )
  select
    v_session.id,
    p_client_id,
    item.goal_id,
    item.correct,
    item.incorrect,
    p_test_run_id
  from jsonb_to_recordset(v_acquisition_trials)
    as item(goal_id uuid, correct integer, incorrect integer);

  return v_session;
end;
$$;

revoke execute on function public.create_clinical_session(uuid, date, text, jsonb, jsonb, uuid)
from public, anon, authenticated;

grant execute on function public.create_clinical_session(uuid, date, text, jsonb, jsonb, uuid)
to authenticated;

