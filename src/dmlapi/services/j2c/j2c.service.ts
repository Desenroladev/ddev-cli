
import { BaseService } from '../base/base.service';

export class J2cService extends BaseService {

    tag = 'j2c';
    template = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(
    fv_jsonb    jsonb[]
) returns {{schema_data}}.{{table_name}}[]
    language plpgsql
as $function$
------------------------------------------------------------------
-- Desenrola Dev: Turns json into a record collection
------------------------------------------------------------------
-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2020 desenroladev.com.br
------------------------------------------------------------------
-- {{schema_data}}.{{table_name}}[]: jsonb to collection
------------------------------------------------------------------
declare
    lr_rrow         {{schema_data}}.{{table_name}};
    lr_jrow         jsonb;
    lr_count        int := 1;
    lv_data         {{schema_data}}.{{table_name}}[];
begin
    foreach lr_jrow in array fv_jsonb loop
        lr_rrow := {{schema_create}}.dmlapi_{{table_name}}_j2r(fv_jsonb => lr_jrow);
        lv_data[lr_count] := lr_rrow;
        lr_count = lr_count + 1;
    end loop;
    return lv_data;
end;
$function$
;
`];
}
