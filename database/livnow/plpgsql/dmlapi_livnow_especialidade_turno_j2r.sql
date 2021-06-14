
create or replace function livnow.dmlapi_livnow_especialidade_turno_j2r(
    fv_jsonb jsonb
)
    returns livnow.livnow_especialidade_turno
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- livnow.livnow_especialidade_turno: jsonb to record
------------------------------------------------------------------
declare
    lv_data             livnow.livnow_especialidade_turno;
begin
    ------------------------------------------------------------
    lv_data.id                                        = fv_jsonb ->> 'id';                                        --001 uuid
    lv_data.especialidade_id                          = fv_jsonb ->> 'especialidade_id';                          --002 uuid
    lv_data.turno_id                                  = fv_jsonb ->> 'turno_id';                                  --003 uuid
    lv_data.data_inclusao                             = fv_jsonb ->> 'data_inclusao';                             --004 timestamp with time zone
    lv_data.ativo                                     = fv_jsonb ->> 'ativo';                                     --005 boolean
    lv_data.data_inativacao                           = fv_jsonb ->> 'data_inativacao';                           --006 timestamp with time zone not null
    lv_data.inativo_id                                = fv_jsonb ->> 'inativo_id';                                --007 integer not null
    lv_data.procedimento_id                           = fv_jsonb ->> 'procedimento_id';                           --008 character varying(8)
    ------------------------------------------------------------
    return lv_data;
end;
$function$;