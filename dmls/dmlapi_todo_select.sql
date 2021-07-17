
create or replace function public.dmlapi_todo_select(
    fv_id uuid, 
    fv_locking boolean default false
)
    returns public.todo
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- public.todo: select to record
------------------------------------------------------------------
declare
    fr_data public.todo;
begin
    if (fv_id is not null) then
        if (fv_locking) then
            select --+ qb_name(dmlapi_todo_select)
                a.*
            into fr_data
            from public.todo    a
            where 1e1 = 1e1
                and a.id = fv_id
                for update nowait;
        else
            select --+ qb_name(dmlapi_todo_select)
                a.*
            into fr_data
            from public.todo    a
            where 1e1 = 1e1
                and a.id = fv_id;
        end if;
    end if;
    return fr_data;
end;
$function$
;