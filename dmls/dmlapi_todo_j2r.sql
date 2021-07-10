
create or replace function public.dmlapi_todo_j2r(
    fv_jsonb jsonb
)
    returns public.todo
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- public.todo: jsonb to record
------------------------------------------------------------------
declare
    lv_data             public.todo;
begin
    ------------------------------------------------------------
    lv_data.id                                        = coalesce((fv_jsonb->>'id')::uuid, gen_random_uuid());                                        --001 uuid not null
    lv_data.title                                     = fv_jsonb->>'title';                                     --002 character varying(60) not null
    lv_data.created_at                                = coalesce((fv_jsonb->>'created_at')::timestamp with time zone, now());                                --003 timestamp with time zone not null
    ------------------------------------------------------------
    return lv_data;
end;
$function$;