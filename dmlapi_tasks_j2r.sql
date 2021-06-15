
create or replace function public.dmlapi_tasks_j2r(
    fv_jsonb jsonb
)
    returns public.tasks
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- public.tasks: jsonb to record
------------------------------------------------------------------
declare
    lv_data             public.tasks;
begin
    ------------------------------------------------------------
    lv_data.id                                        = fv_jsonb ->> 'id';                                        --001 uuid
    lv_data.title                                     = fv_jsonb ->> 'title';                                     --002 character varying(250)
    lv_data.created_at                                = fv_jsonb ->> 'created_at';                                --003 timestamp with time zone
    lv_data.ativo                                     = fv_jsonb ->> 'ativo';                                     --004 boolean
    lv_data.data_inativacao                           = fv_jsonb ->> 'data_inativacao';                           --005 timestamp with time zone not null
    lv_data.inativo_id                                = fv_jsonb ->> 'inativo_id';                                --006 integer not null
    lv_data.usuario_inativou_id                       = fv_jsonb ->> 'usuario_inativou_id';                       --007 uuid not null
    ------------------------------------------------------------
    return lv_data;
end;
$function$;