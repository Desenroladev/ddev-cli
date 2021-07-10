
create or replace function public.dmlapi_todo_purge(
    fv_id uuid
)
    returns void 
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_todo_purge: inactive record
------------------------------------------------------------------
declare
    lr_data    public.todo;
begin
    if (fv_id is not null) then
        lr_data := public.dmlapi_todo_select(fv_id      => fv_id,
                                                                fv_locking => true);
        if (lr_data.id is not null) then
            ------------------------------------
            delete from public.todo 
            where 1 = 1
                and id = fv_id;
            ------------------------------------
        end if;
    end if;
exception when others then
    raise;
end; $function$;