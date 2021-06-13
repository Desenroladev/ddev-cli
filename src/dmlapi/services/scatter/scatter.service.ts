
import { BaseService } from '../base/base.service';
import * as path from 'path';

export class ScatterService extends BaseService {

    file_name = `inbound_{{table_name}}_{{tag}}.sql`;
    tag = 'scatter';

    template = [
`create or replace function {{schema_create}}.inbound_{{table_name}}_{{tag}}(
    fr_payload in jsonb
)   returns jsonb[]
language plpgsql
as $function$
------------------------------------------------------------------
-- LIVNOW: LIV Noop Of Work
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- {{table_schema}}.{{table_name}}: scatter to jsonb[]
------------------------------------------------------------------
declare
begin
    return {{schema_create}}.inbound_generic_{{tag}}(fr_payload, '{{segment}}');
end;
$function$
;
`];


tpl_generic:string[] = [
`create or replace function {{schema_create}}.inbound_generic_{{tag}}(
    fr_payload in jsonb,
    fr_segment in varchar
) returns jsonb[]
  language plpgsql
as $function$
------------------------------------------------------------------
-- LIVNOW: LIV Noop Of Work
------------------------------------------------------------------
-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2020 desenroladev.com.br
------------------------------------------------------------------
-- generic: scatter to jsonb
------------------------------------------------------------------
declare
------------------------------------------------------------------
    cur_payload cursor for 
        select
            jsonb_array_elements(fr_payload->'data') as segment;
-------------------------------------------------------------------
    lv_data    jsonb[];
------------------------------------------------------------------
    lv_payload jsonb;
    lv_index   int;
    lv_aux     varchar(100);
    lv_seg     varchar(500);
    lv_arr     varchar(100)[];
begin
-------------------------------------------------------------------
    lv_index := 1;
    lv_seg   := '';
-------------------------------------------------------------------
    select 
        string_to_array(cast(fr_payload->>'segment' as varchar), '/') 
        into lv_arr;
-------------------------------------------------------------------
    foreach lv_aux in array lv_arr 
    loop 
        if lv_index > 2 then
            lv_seg := lv_seg ||'/'|| lv_aux;
        end if;
        lv_index := lv_index + 1;
    end loop;
-------------------------------------------------------------------
    if lv_seg <> fr_segment then
        raise exception 'segmento: % invalido', fr_payload->'segment';
    end if;
-------------------------------------------------------------------
    lv_index := 1;
    if (fr_payload is not null) then
        for lv_payload in cur_payload 
        loop
            lv_data[lv_index] := lv_payload.segment;
            lv_index          := lv_index + 1;
        end loop;
    end if;
-------------------------------------------------------------------
    return lv_data;
end;
$function$
;`
]

    async buildGeneric(data:any) {
        
        let resolve = path.resolve('/');
        this.folder_file = data.folder_file || resolve;

        let file_name = `inbound_generic_{{tag}}.sql`;
        file_name = file_name.replace('{{tag}}', this.tag);

        let codigo = this.tpl_generic[0];

        codigo = codigo.replace('{{schema_create}}', data.schema_create);
        codigo = codigo.replace('{{table_name}}', data.table_name);
        codigo = codigo.replace('{{tag}}', this.tag);

        let build = {
            file_name, 
            codigo
        };

        this.toFile(build);
    }

}
