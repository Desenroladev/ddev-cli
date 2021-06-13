
create or replace function livnow.dmlapi_livnow_usuario_j2r(
    fv_jsonb jsonb
)
    returns livnow.livnow_usuario
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- livnow.livnow_usuario: jsonb to record
------------------------------------------------------------------
declare
    lv_data             livnow.livnow_usuario;
begin
    ------------------------------------------------------------
    lv_data.id                                        = fv_jsonb ->> 'id';                                        --001 uuid
    lv_data.usuario                                   = fv_jsonb ->> 'usuario';                                   --002 character varying(50)
    lv_data.senha                                     = fv_jsonb ->> 'senha';                                     --003 character varying(120)
    lv_data.source_id                                 = fv_jsonb ->> 'source_id';                                 --004 character varying(150)
    lv_data.pessoa_id                                 = fv_jsonb ->> 'pessoa_id';                                 --005 uuid not null
    lv_data.perfil_id                                 = fv_jsonb ->> 'perfil_id';                                 --007 uuid not null
    lv_data.data_inativacao                           = fv_jsonb ->> 'data_inativacao';                           --008 timestamp with time zone not null
    lv_data.inativo_id                                = fv_jsonb ->> 'inativo_id';                                --009 integer not null
    lv_data.ativo                                     = fv_jsonb ->> 'ativo';                                     --010 boolean not null
    ------------------------------------------------------------
    return lv_data;
end;
$function$;