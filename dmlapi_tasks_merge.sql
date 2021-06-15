
create or replace function public.dmlapi_tasks_merge(
    fr_data public.tasks,
    fv_old_id uuid default null
) 
    returns public.tasks
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_tasks_merge: insert or update
------------------------------------------------------------------
declare
    lr_data    public.tasks;
begin
    -------------------------------------------------------------------------------------
    -- UPDATE FROM PK WITH OLD ID
    -------------------------------------------------------------------------------------
    if fv_old_id is null then
        fv_old_id := fr_data.id;
    end if;
    -------------------------------------------------------------------------------------
    if (fr_data.id is not null) then
    lr_data := public.dmlapi_tasks_select(fv_id      => fv_old_id,
                                                                fv_locking => true);
    if (lr_data.id is not null) then
        update --+ qb_name(dmlapi_tasks_merge)
                public.tasks
            set 
            id                                        = fr_data.id,                                        --001 uuid
            title                                     = fr_data.title,                                     --002 character varying(250)
            created_at                                = fr_data.created_at,                                --003 timestamp with time zone
            ativo                                     = fr_data.ativo,                                     --004 boolean
            data_inativacao                           = fr_data.data_inativacao,                           --005 timestamp with time zone not null
            inativo_id                                = fr_data.inativo_id,                                --006 integer not null
            usuario_inativou_id                       = fr_data.usuario_inativou_id                        --007 uuid not null
        where 1e1 = 1e1
            and id = fv_old_id
        returning * into fr_data;
    else
        insert --+ qb_name(dmlapi_tasks_merge)
        into public.tasks
            (
                id,                                        --001 uuid
              title,                                     --002 character varying(250)
              created_at,                                --003 timestamp with time zone
              ativo,                                     --004 boolean
              data_inativacao,                           --005 timestamp with time zone not null
              inativo_id,                                --006 integer not null
              usuario_inativou_id                        --007 uuid not null
            )
        values(
                fr_data.id,                                        --001 uuid
              fr_data.title,                                     --002 character varying(250)
              fr_data.created_at,                                --003 timestamp with time zone
              fr_data.ativo,                                     --004 boolean
              fr_data.data_inativacao,                           --005 timestamp with time zone not null
              fr_data.inativo_id,                                --006 integer not null
              fr_data.usuario_inativou_id                        --007 uuid not null
            ) 
        returning *
            into fr_data;
    end if;
    else
    insert --+ qb_name(dmlapi_tasks_merge)
        into public.tasks
            (
            id,                                        --001 uuid
              title,                                     --002 character varying(250)
              created_at,                                --003 timestamp with time zone
              ativo,                                     --004 boolean
              data_inativacao,                           --005 timestamp with time zone not null
              inativo_id,                                --006 integer not null
              usuario_inativou_id                        --007 uuid not null  
            )
    values(
            fr_data.id,                                        --001 uuid
              fr_data.title,                                     --002 character varying(250)
              fr_data.created_at,                                --003 timestamp with time zone
              fr_data.ativo,                                     --004 boolean
              fr_data.data_inativacao,                           --005 timestamp with time zone not null
              fr_data.inativo_id,                                --006 integer not null
              fr_data.usuario_inativou_id                        --007 uuid not null
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
create or replace function public.dmlapi_tasks_merge(fr_data jsonb)
returns public.tasks
language plpgsql
security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_tasks_merge: insert or update collection
------------------------------------------------------------------
declare
    lr_data           public.tasks;
begin
    lr_data := public.dmlapi_tasks_j2r(fv_jsonb => fr_data);
    if lr_data.id is null then
        lr_data.id := gen_random_uuid();
    end if;
    return public.dmlapi_tasks_merge(fr_data => lr_data, fv_old_id => (fr_data->>'old_id')::uuid);
exception when others then
raise;
end; $function$;