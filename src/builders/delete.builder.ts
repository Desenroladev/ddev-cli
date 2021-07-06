import { BaseBuilder } from "./base.builder";

export class DeleteBuilder extends BaseBuilder {

    constructor() {
        const templates = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{sufixo}}(
    fv_id {{pk_type}}
)
    returns void 
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_{{table_name}}_purge: inactive record
------------------------------------------------------------------
declare
    lr_data    {{table_schema}}.{{table_name}};
begin
    if (fv_id is not null) then
        lr_data := {{table_schema}}.dmlapi_{{table_name}}_select(fv_id      => fv_id,
                                                                fv_locking => true);
        if (lr_data.{{pk_name}} is not null) then
            ------------------------------------
            delete from {{table_schema}}.{{table_name}} 
            where 1 = 1
                and {{pk_name}} = fv_id;
            ------------------------------------
        end if;
    end if;
exception when others then
    raise;
end; $function$;`];
        super('purge', templates);
    }

}