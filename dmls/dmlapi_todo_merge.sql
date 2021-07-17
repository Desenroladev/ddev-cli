
create or replace function public.dmlapi_todo_merge(
    fr_data public.todo,
    fv_old_id uuid default null
) 
    returns public.todo
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_todo_merge: insert or update
------------------------------------------------------------------
declare
    lr_data    public.todo;
begin
    -------------------------------------------------------------------------------------
    -- UPDATE FROM PK WITH OLD ID
    -------------------------------------------------------------------------------------
    if fv_old_id is null then
        fv_old_id := fr_data.id;
    end if;
    -------------------------------------------------------------------------------------
    if (fr_data.id is not null) then
    lr_data := public.dmlapi_todo_select(fv_id      => fv_old_id,
                                                                fv_locking => true);
    if (lr_data.id is not null) then
        update --+ qb_name(dmlapi_todo_merge)
                public.todo
            set 
            id                                        = fr_data.id,                                        --001 uuid
            title                                     = fr_data.title,                                     --002 character varying(60)
            created_at                                = fr_data.created_at,                                --003 timestamp with time zone
            concluded                                 = fr_data.concluded,                                 --004 boolean
            concluded_at                              = fr_data.concluded_at                               --005 timestamp with time zone not null
        where 1e1 = 1e1
            and id = fv_old_id
        returning * into fr_data;
    else
        insert --+ qb_name(dmlapi_todo_merge)
        into public.todo
            (
                id,                                        --001 uuid
              title,                                     --002 character varying(60)
              created_at,                                --003 timestamp with time zone
              concluded,                                 --004 boolean
              concluded_at                               --005 timestamp with time zone not null
            )
        values(
                fr_data.id,                                        --001 uuid
              fr_data.title,                                     --002 character varying(60)
              fr_data.created_at,                                --003 timestamp with time zone
              fr_data.concluded,                                 --004 boolean
              fr_data.concluded_at                               --005 timestamp with time zone not null
            ) 
        returning *
            into fr_data;
    end if;
    else
    insert --+ qb_name(dmlapi_todo_merge)
        into public.todo
            (
            id,                                        --001 uuid
              title,                                     --002 character varying(60)
              created_at,                                --003 timestamp with time zone
              concluded,                                 --004 boolean
              concluded_at                               --005 timestamp with time zone not null  
            )
    values(
            fr_data.id,                                        --001 uuid
              fr_data.title,                                     --002 character varying(60)
              fr_data.created_at,                                --003 timestamp with time zone
              fr_data.concluded,                                 --004 boolean
              fr_data.concluded_at                               --005 timestamp with time zone not null
            )
    returning *
        into fr_data;
    end if;
    return fr_data;
exception when others then
    raise;
end;
$function$
;


----------------------------------------------------
create or replace function public.dmlapi_todo_merge(fv_jsonb jsonb)
returns public.todo
language plpgsql
security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_todo_merge: insert or update collection
------------------------------------------------------------------
declare
    lr_data           public.todo;
    lv_jsonb          jsonb;
begin
    ------------------------------------------------------------------------------
    lr_data := public.dmlapi_todo_select(fv_id      => (fv_jsonb->>'id')::uuid,
                                            fv_locking => true);
    ------------------------------------------------------------------------------
    if lr_data.id is not null then
        lv_jsonb := public.dmlapi_todo_r2j(fr_data => lr_data);
        lv_jsonb := lv_jsonb || fv_jsonb;
    else
        lv_jsonb := fv_jsonb;
    end if;
    ------------------------------------------------------------------------------
    lr_data := public.dmlapi_todo_j2r(fv_jsonb => lv_jsonb);
    ------------------------------------------------------------------------------
    if lr_data.id is null then
        lr_data.id := gen_random_uuid();
    end if;
    ------------------------------------------------------------------------------
    return public.dmlapi_todo_merge(fr_data => lr_data, fv_old_id => (fv_jsonb->>'old_id')::uuid);
exception when others then
raise;
end; $function$;