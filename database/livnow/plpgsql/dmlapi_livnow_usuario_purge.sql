
create or replace function livnow.dmlapi_livnow_usuario_purge(
    fv_id uuid,
    fv_usuario_id uuid,
    fv_inativo_id int default 0
)
    returns void 
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright 2021 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2021 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_livnow_usuario_purge: inactive record
------------------------------------------------------------------
declare
    lr_data    livnow.livnow_usuario;
begin
    if (fv_id is not null) then
        lr_data := livnow.dmlapi_livnow_usuario_select(fv_id      => fv_id,
                                                                fv_locking => true);
        if (lr_data.id is not null) then
            ------------------------------------
            lr_data.ativo               := false;
            lr_data.data_inativacao     := now(); 
            lr_data.inativo_id          := fv_inativo_id;
            lv_data.usuario_inativou_id := fv_usuario_id;
            ------------------------------------
            perform livnow.dmlapi_livnow_usuario_merge(fr_data => lr_data);
            ------------------------------------
        end if;
    end if;
exception when others then
    raise;
end;
$function$
;