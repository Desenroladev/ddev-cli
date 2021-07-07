import { DmlModel } from "../models/dml.model";
import { SourceCode } from "../models/source-code.model";
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

`create or replace function {{schema_create}}.dmlapi_{{table_name}}_merge(fv_jsonb jsonb)
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
    lv_jsonb          jsonb;
begin
    ------------------------------------------------------------------------------
    lr_data := public.dmlapi_{{table_name}}_select(fv_id      => (fv_jsonb->>'{{pk_name}}')::{{pk_type}},
                                            fv_locking => true);
    ------------------------------------------------------------------------------
    if lr_data.{{pk_name}} is not null then
        lv_jsonb := public.dmlapi_{{table_name}}_r2j(fr_data => lr_data);
        lv_jsonb := lv_jsonb || fv_jsonb;
    else
        lv_jsonb := fv_jsonb;
    end if;
    ------------------------------------------------------------------------------
    lr_data := {{schema_create}}.dmlapi_{{table_name}}_j2r(fv_jsonb => lv_jsonb);
    ------------------------------------------------------------------------------
    if lr_data.{{pk_name}} is null then
        lr_data.{{pk_name}} := gen_random_uuid();
    end if;
    ------------------------------------------------------------------------------
    return {{schema_create}}.dmlapi_{{table_name}}_merge(fr_data => lr_data, fv_old_id => (fv_jsonb->>'old_id')::{{pk_type}});
exception when others then
raise;
end; $function$;`];
        super('merge', templates);
    }


    async build(model: DmlModel) : Promise<SourceCode> {
    
        const sql = `select 
                        column_name, 
                        ordinal_position,
                        data_type,
                        udt_name,
                        character_maximum_length,
                        numeric_precision,
                        is_nullable
                    from information_schema.columns 
                    where table_name = $1
                        and table_schema = $2
                        and table_catalog = $3
                    order by ordinal_position`;
    
        const binds: any = [
            model.table.name,
            model.table_schema,
            model.table_catalog
        ];

        const columns = await this.db.query(sql, binds);
    
        let tpl_update_rows = `{{column_name}} {{espaco_left}} = fr_data.{{column_name}}{{virgula}} {{espaco_rigth}} --{{ordem}} {{data_type}}`
    
        let update_rows = columns.map((one: any, index: number) => {
    
            let espaco_left = this.generateSpaces(one.column_name);
            
            let espaco_rigth = this.generateSpaces(one.column_name);
            
            let ordem = this.formatWithZero(one.ordinal_position, 3);
            let data_type = one.data_type;
    
            if(one.character_maximum_length > 0) {
                data_type += `(${one.character_maximum_length})`;
            }
    
            if(one.is_nullable == 'YES') {
                data_type += ` not null`;
            }
    
            return tpl_update_rows.replace(/\{{column_name}}/gi, one.column_name)
                          .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                          .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                          .replace(/\{{ordem}}/gi, ordem)
                          .replace(/\{{data_type}}/gi, data_type)
                          .replace(/\{{virgula}}/gi, columns.length == (index+1) ? ' ':',');
        });
    
        let merge_update_rows = update_rows.join('\n            ');
    
    
        let tpl_into_rows = `{{column_name}}{{virgula}} {{espaco_left}} --{{ordem}} {{data_type}}`
        let into_rows = columns.map((one: any, index: number) => {
    
          let espaco_left = this.generateSpaces(one.column_name);
          
          let espaco_rigth = this.generateSpaces(one.column_name);
          
          let ordem = this.formatWithZero(one.ordinal_position, 3);
          let data_type = one.data_type;
    
          if(one.character_maximum_length > 0) {
              data_type += `(${one.character_maximum_length})`;
          }
    
          if(one.is_nullable == 'YES') {
              data_type += ` not null`;
          }
    
          return tpl_into_rows.replace(/\{{column_name}}/gi, one.column_name)
                        .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                        .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                        .replace(/\{{ordem}}/gi, ordem)
                        .replace(/\{{data_type}}/gi, data_type)
                        .replace(/\{{virgula}}/gi, columns.length == (index+1) ? ' ':',');
        });
    
        let merge_into_rows = into_rows.join('\n              ');
    
    
        let tpl_values_rows = `fr_data.{{column_name}}{{virgula}} {{espaco_left}} --{{ordem}} {{data_type}}`
        let values_rows = columns.map((one:any, index: number) => {
    
          let espaco_left = this.generateSpaces(one.column_name);
          
          let espaco_rigth = this.generateSpaces(one.column_name);
          
          let ordem = this.formatWithZero(one.ordinal_position, 3);
          let data_type = one.data_type;
    
          if(one.character_maximum_length > 0) {
              data_type += `(${one.character_maximum_length})`;
          }
    
          if(one.is_nullable == 'YES') {
              data_type += ` not null`;
          }
    
          return tpl_values_rows.replace(/\{{column_name}}/gi, one.column_name)
                        .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                        .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                        .replace(/\{{ordem}}/gi, ordem)
                        .replace(/\{{data_type}}/gi, data_type)
                        .replace(/\{{virgula}}/gi, columns.length == (index+1) ? ' ':',');
        });
    
        let merge_values_rows = values_rows.join('\n              ');
    
        let file_name = this.file_name;
    
        file_name = file_name.replace('{{schema_create}}', model.schema_create);
        file_name = file_name.replace('{{table_name}}', model.table.name);
        file_name = file_name.replace('{{sufixo}}', this.sufixo);
    
        let code = this.templates.map(tpl => {
                            return tpl.replace(/\{{schema_create}}/gi, model.schema_create)
                                    .replace(/\{{table_name}}/gi, model.table.name)
                                    .replace(/\{{table_schema}}/gi, model.table_schema)
                                    .replace(/\{{ano}}/gi, new Date().getFullYear()+'')
                                    .replace(/\{{sufixo}}/gi, this.sufixo)
                                    .replace(/\{{pk_type}}/gi, (model.table.pk_type || 'uuid') )
                                    .replace(/\{{pk_name}}/gi, (model.table.pk_name || 'id') )
                                    .replace(/\{{update_row_data}}/gi, merge_update_rows)
                                    .replace(/\{{into_row_data}}/gi, merge_into_rows)
                                    .replace(/\{{into_values_data}}/gi, merge_values_rows);
                        }).join('\n\n\n----------------------------------------------------\n');

        const source : SourceCode = {
            folder: model.folder,
            file_name,
            code
        };

        return source
    }

}