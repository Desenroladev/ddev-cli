
import { BaseService } from '../base/base.service';

export class InspectService extends BaseService {

    file_name = `inbound_{{table_name}}_{{tag}}.sql`;
    tag = 'inspect';
    template = [
`create or replace function {{schema_create}}.inbound_{{table_name}}_{{tag}}(
    fv_jsonb jsonb[]
)
    returns table(data jsonb[], erros jsonb)
    language plpgsql
as $function$
------------------------------------------------------------------
-- LIVNOW: LIV Noop Of Work
------------------------------------------------------------------
-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2020 desenroladev.com.br
------------------------------------------------------------------
-- {{table_schema}}.{{table_name}}[]: jsonb to collection
------------------------------------------------------------------
declare
    lr_rrow         {{table_schema}}.{{table_name}};
    lr_jrow         jsonb;
    lr_count        int     := 1;
    lv_data         jsonb[];
    lv_erro         jsonb   := '{}';
    lv_erros        jsonb   := '[]';
    lr_data         jsonb   := '[]';
begin
--------------------------------------------------------------------------------------------
    foreach lr_jrow in array fv_jsonb loop   
    begin
--------------------------------------------------------------------------------------------
        perform {{table_schema}}.dmlapi_{{table_name}}_j2r(fv_jsonb => lr_jrow);
        lv_data[lr_count] := lr_jrow;
        lr_count = lr_count + 1;
--------------------------------------------------------------------------------------------
    exception when others then
--------------------------------------------------------------------------------------------
        lr_count = lr_count + 1;
        lv_erro := lr_jrow::jsonb || jsonb_build_object('erros', jsonb_build_object(
                                                                    'code', sqlstate, 
                                                                    'sqlstate', sqlerrm
                                                                )
                                                        );
        lv_erros := lv_erros || lv_erro;
    end;
--------------------------------------------------------------------------------------------
    end loop;
--------------------------------------------------------------------------------------------
    return query select lv_data, lv_erros;
end;
$function$
;
`];
}
