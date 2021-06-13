import { BaseBuilder } from "./base.builder";

export class R2JBuilder extends BaseBuilder {

    constructor() {
        const templates = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{sufixo}}(
    fr_data {{table_schema}}.{{table_name}}
)
    returns jsonb
    language plpgsql
    security definer
AS $function$
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- {{table_schema}}.{{table_name}}: record to jsonb
------------------------------------------------------------------
declare
    lv_jsonb jsonb;
begin
    lv_jsonb := row_to_json(fr_data,  -- record
                            true);    -- pretty_bool
    return lv_jsonb;
end;
$function$;`];

        super('r2j', templates);
    }

}