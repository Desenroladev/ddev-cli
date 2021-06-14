
create or replace function livnow.dmlapi_livnow_especialidade_turno_merge(
    fr_data livnow.livnow_especialidade_turno,
    fv_old_id uuid default null
) 
    returns livnow.livnow_especialidade_turno
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_livnow_especialidade_turno_merge: insert or update
------------------------------------------------------------------
declare
    lr_data    livnow.livnow_especialidade_turno;
begin
    -------------------------------------------------------------------------------------
    -- UPDATE FROM PK WITH OLD ID
    -------------------------------------------------------------------------------------
    if fv_old_id is null then
        fv_old_id := fr_data.id;
    end if;
    -------------------------------------------------------------------------------------
    if (fr_data.id is not null) then
    lr_data := livnow.dmlapi_livnow_especialidade_turno_select(fv_id      => fv_old_id,
                                                                fv_locking => true);
    if (lr_data.id is not null) then
        update --+ qb_name(dmlapi_livnow_especialidade_turno_merge)
                livnow.livnow_especialidade_turno
            set 
            id                                        = fr_data.id,                                        --001 uuid
            especialidade_id                          = fr_data.especialidade_id,                          --002 uuid
            turno_id                                  = fr_data.turno_id,                                  --003 uuid
            data_inclusao                             = fr_data.data_inclusao,                             --004 timestamp with time zone
            ativo                                     = fr_data.ativo,                                     --005 boolean
            data_inativacao                           = fr_data.data_inativacao,                           --006 timestamp with time zone not null
            inativo_id                                = fr_data.inativo_id,                                --007 integer not null
            procedimento_id                           = fr_data.procedimento_id                            --008 character varying(8)
        where 1e1 = 1e1
            and id = fv_old_id
        returning * into fr_data;
    else
        insert --+ qb_name(dmlapi_livnow_especialidade_turno_merge)
        into livnow.livnow_especialidade_turno
            (
                id,                                        --001 uuid
              especialidade_id,                          --002 uuid
              turno_id,                                  --003 uuid
              data_inclusao,                             --004 timestamp with time zone
              ativo,                                     --005 boolean
              data_inativacao,                           --006 timestamp with time zone not null
              inativo_id,                                --007 integer not null
              procedimento_id                            --008 character varying(8)
            )
        values(
                fr_data.id,                                        --001 uuid
              fr_data.especialidade_id,                          --002 uuid
              fr_data.turno_id,                                  --003 uuid
              fr_data.data_inclusao,                             --004 timestamp with time zone
              fr_data.ativo,                                     --005 boolean
              fr_data.data_inativacao,                           --006 timestamp with time zone not null
              fr_data.inativo_id,                                --007 integer not null
              fr_data.procedimento_id                            --008 character varying(8)
            ) 
        returning *
            into fr_data;
    end if;
    else
    insert --+ qb_name(dmlapi_livnow_especialidade_turno_merge)
        into livnow.livnow_especialidade_turno
            (
            id,                                        --001 uuid
              especialidade_id,                          --002 uuid
              turno_id,                                  --003 uuid
              data_inclusao,                             --004 timestamp with time zone
              ativo,                                     --005 boolean
              data_inativacao,                           --006 timestamp with time zone not null
              inativo_id,                                --007 integer not null
              procedimento_id                            --008 character varying(8)  
            )
    values(
            fr_data.id,                                        --001 uuid
              fr_data.especialidade_id,                          --002 uuid
              fr_data.turno_id,                                  --003 uuid
              fr_data.data_inclusao,                             --004 timestamp with time zone
              fr_data.ativo,                                     --005 boolean
              fr_data.data_inativacao,                           --006 timestamp with time zone not null
              fr_data.inativo_id,                                --007 integer not null
              fr_data.procedimento_id                            --008 character varying(8)
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
create or replace function livnow.dmlapi_livnow_especialidade_turno_merge(fr_data jsonb)
returns livnow.livnow_especialidade_turno
language plpgsql
security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_livnow_especialidade_turno_merge: insert or update collection
------------------------------------------------------------------
declare
    lr_data           livnow.livnow_especialidade_turno;
begin
    lr_data := livnow.dmlapi_livnow_especialidade_turno_j2r(fv_jsonb => fr_data);
    if lr_data.id is null then
        lr_data.id := gen_random_uuid();
    end if;
    return livnow.dmlapi_livnow_especialidade_turno_merge(fr_data => lr_data, fv_old_id => (fr_data->>'old_id')::uuid);
exception when others then
raise;
end; $function$;