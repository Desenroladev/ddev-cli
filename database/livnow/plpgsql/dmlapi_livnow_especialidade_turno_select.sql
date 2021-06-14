
create or replace function livnow.dmlapi_livnow_especialidade_turno_select(
    fv_id uuid, 
    fv_locking boolean default false
)
    returns livnow.livnow_especialidade_turno
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- livnow.livnow_especialidade_turno: select to record
------------------------------------------------------------------
declare
    fr_data livnow.livnow_especialidade_turno;
begin
    if (fv_id is not null) then
        if (fv_locking) then
            select --+ qb_name(dmlapi_livnow_especialidade_turno_select)
                a.*
            into fr_data
            from livnow.livnow_especialidade_turno    a
            where 1e1 = 1e1
                and a.id = fv_id
                for update nowait;
        else
            select --+ qb_name(dmlapi_livnow_especialidade_turno_select)
                a.*
            into fr_data
            from livnow.livnow_especialidade_turno    a
            where 1e1 = 1e1
                and a.id = fv_id;
        end if;
    end if;
    return fr_data;
end;
$function$
;