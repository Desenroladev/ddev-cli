import { BaseBuilder } from "./base.builder";

export class MergeBuilder extends BaseBuilder {

    constructor() {
        const templates = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{sufixo}}(
    fr_data {{table_schema}}.{{table_name}},
    fv_old_id {{pk_type}} default null
) 
    returns {{table_schema}}.{{table_name}}
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_{{table_name}}_{{sufixo}}: insert or update
------------------------------------------------------------------
declare
    lr_data    {{table_schema}}.{{table_name}};
begin
    -------------------------------------------------------------------------------------
    -- UPDATE FROM PK WITH OLD ID
    -------------------------------------------------------------------------------------
    if fv_old_id is null then
        fv_old_id := fr_data.{{pk_name}};
    end if;
    -------------------------------------------------------------------------------------
    if (fr_data.{{pk_name}} is not null) then
    lr_data := {{schema_create}}.dmlapi_{{table_name}}_select(fv_id      => fv_old_id,
                                                                fv_locking => true);
    if (lr_data.{{pk_name}} is not null) then
        update --+ qb_name(dmlapi_{{table_name}}_merge)
                {{table_schema}}.{{table_name}}
            set 
            {{update_row_data}}
        where 1e1 = 1e1
            and {{pk_name}} = fv_old_id
        returning * into fr_data;
    else
        insert --+ qb_name(dmlapi_{{table_name}}_merge)
        into {{table_schema}}.{{table_name}}
            (
                {{into_row_data}}
            )
        values(
                {{into_values_data}}
            ) 
        returning *
            into fr_data;
    end if;
    else
    insert --+ qb_name(dmlapi_{{table_name}}_merge)
        into {{table_schema}}.{{table_name}}
            (
            {{into_row_data}}  
            )
    values(
            {{into_values_data}}
            )
    returning *
        into fr_data;
    end if;
    return fr_data;
exception when others then
    raise;
end;
$function$
;`,

`create or replace function {{schema_create}}.dmlapi_{{table_name}}_merge(fr_data jsonb)
returns {{schema_create}}.{{table_name}}
language plpgsql
security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_{{table_name}}_merge: insert or update collection
------------------------------------------------------------------
declare
    lr_data           {{schema_create}}.{{table_name}};
begin
    lr_data := {{schema_create}}.dmlapi_{{table_name}}_j2r(fv_jsonb => fr_data);
    if lr_data.{{pk_name}} is null then
        lr_data.{{pk_name}} := gen_random_uuid();
    end if;
    return {{schema_create}}.dmlapi_{{table_name}}_merge(fr_data => lr_data, fv_old_id => (fr_data->>'old_id')::{{pk_type}});
exception when others then
raise;
end; $function$;`];
        super('merge', templates);
    }

}