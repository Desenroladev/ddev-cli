
import { BaseService } from '../base/base.service';

export class MtaService extends BaseService {

    file_name = `inbound_{{table_name}}_{{tag}}.sql`;
    tag = 'mta';
    template = [`
create or replace function {{schema_create}}.inbound_{{table_name}}_{{tag}}(fr_data jsonb)
returns jsonb
language plpgsql
AS $function$
    ------------------------------------------------------------------
    -- livsync: Quality Assurance Testing
    ------------------------------------------------------------------
    -- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)
    -- (c) Copyright 2020 desenroladev.com.br
    ------------------------------------------------------------------
    -- {{schema_create}}.inbound_{{table_name}}_{{tag}}: Map Transform Apply API
    ------------------------------------------------------------------
    declare
    lv_index        int;
    lv_source_id    varchar(150);
    lv_id           uuid;
    lr_data         jsonb[];
    lv_i	        jsonb;
    lv_erros        jsonb := '[]';
    lv_erro         jsonb := '{}';
    lv_rec   		record;
    ------------------------------------------
    lr_{{table_name}}_arr       {{schema_data}}.{{table_name}}[];
    lr_{{table_name}}           {{schema_data}}.{{table_name}};
    ------------------------------------------
    lv_apply_start  timestamp;
    lv_apply_end    timestamp;
begin
    ------------------------------------------------------------------------------------
    lv_apply_start := clock_timestamp();
    ------------------------------------------------------------------------------------
    if (fr_data is not null) then
        lr_data := {{schema_create}}.inbound_{{table_name}}_scatter(fr_payload => fr_data);
    ---------------------------{{schema_data}}.livnow_pessoa-------------------------------------
        if (lr_data is not null) then
        lv_rec := {{schema_create}}.inbound_{{table_name}}_inspect(fv_jsonb => lr_data);
        lv_erros := lv_erros || lv_rec."erros";
    ------------------------------------------------------------------------------------
    lr_{{table_name}}_arr := {{schema_data}}.dmlapi_{{table_name}}_j2c(fv_jsonb => lv_rec."data");
    ------------------------LOOP--------------------------------------------------------                                    
        lv_index := 1;
        foreach lr_{{table_name}} in array lr_{{table_name}}_arr loop
            ---------------------------------------------------
            lv_source_id := lr_{{table_name}}.source_id;
            ---------------------------------------------------
            select 
            p.id into lv_id
            from {{schema_data}}.{{table_name}} p 
            where p.source_id = lv_source_id;
            ---------------------------------------------------
            if lv_id is null then
            lv_id := gen_random_uuid();
            end if;
            ---------------------------------------------------
            lr_{{table_name}}.id            := lv_id;
            lr_{{table_name}}_arr[lv_index] := lr_{{table_name}};
            lv_index := lv_index + 1;
        end loop;
    --------------------------------------------------------------------
        lv_erro  := {{schema_data}}.dmlapi_{{table_name}}_merge(fr_data => lr_{{table_name}}_arr);
        lv_erros := lv_erros || lv_erro;
    ------------------------------------------------------------------------------------
        end if;
    end if;

    lv_apply_end := clock_timestamp();
    raise info '{{schema_create}}.inbound_{{table_name}}_mta in [%]', (lv_apply_end - lv_apply_start);
    return lv_erros;
    --commit; -- ERROR: cannot commit while a subtransaction is active
    exception when others then
        raise;
    end;
$function$;
`];
}
