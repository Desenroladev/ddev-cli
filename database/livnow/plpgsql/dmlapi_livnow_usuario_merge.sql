
create or replace function livnow.dmlapi_livnow_usuario_merge(
    fr_data livnow.livnow_usuario,
    fv_old_id uuid default null
) 
    returns livnow.livnow_usuario
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_livnow_usuario_merge: insert or update
------------------------------------------------------------------
declare
    lr_data    livnow.livnow_usuario;
begin
    -------------------------------------------------------------------------------------
    -- UPDATE FROM PK WITH OLD ID
    -------------------------------------------------------------------------------------
    if fv_old_id is null then
        fv_old_id := fr_data.id;
    end if;
    -------------------------------------------------------------------------------------
    if (fr_data.id is not null) then
    lr_data := livnow.dmlapi_livnow_usuario_select(fv_id      => fv_old_id,
                                                                fv_locking => true);
    if (lr_data.id is not null) then
        update --+ qb_name(dmlapi_livnow_usuario_merge)
                livnow.livnow_usuario
            set 
            {{update_row_data}}
        where 1e1 = 1e1
            and id = fv_old_id
        returning * into fr_data;
    else
        insert --+ qb_name(dmlapi_livnow_usuario_merge)
        into livnow.livnow_usuario
            (
                {{into_row_data}}
            )
        values(
                {{into_values_data}}
            ) 
        returning *
            into fr_data;
    end if;
    else
    insert --+ qb_name(dmlapi_livnow_usuario_merge)
        into livnow.livnow_usuario
            (
            {{into_row_data}}  
            )
    values(
            {{into_values_data}}
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
-------------------------------------------------------------------
create or replace function livnow.dmlapi_livnow_usuario_merge(fr_data jsonb)
returns livnow.livnow_usuario
language plpgsql
security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_livnow_usuario_merge: insert or update collection
------------------------------------------------------------------
declare
    lr_data           livnow.livnow_usuario;
begin
    lr_data := livnow.dmlapi_livnow_usuario_j2r(fv_jsonb => fr_data);
    if lr_data.id is null then
        lr_data.id := gen_random_uuid();
    end if;
    return livnow.dmlapi_livnow_usuario_merge(fr_data => lr_data, fv_old_id => (fr_data->>'old_id')::uuid);
exception when others then
raise;
end; $function$;