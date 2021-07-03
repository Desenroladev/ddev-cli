import { BaseBuilder } from "./base.builder";
import * as fs from 'fs';
import * as path from 'path';
import { SourceCode } from "../models/source-code.model";
import { DmlModel } from "../models/dml.model";

export class J2RBuilder extends BaseBuilder {

    constructor() {
        const templates = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{sufixo}}(
    fv_jsonb jsonb
)
    returns {{table_schema}}.{{table_name}}
    language plpgsql
    security definer
as $function$
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- {{table_schema}}.{{table_name}}: jsonb to record
------------------------------------------------------------------
declare
    lv_data             {{table_schema}}.{{table_name}};
begin
    ------------------------------------------------------------
    {{j2r_rows}}
    ------------------------------------------------------------
    return lv_data;
end;
$function$;`];

        super('j2r', templates);
    }

    async build(model: DmlModel) : Promise<SourceCode> {
        
        const sql = `select 
                        column_name, 
                        ordinal_position,
                        data_type,
                        udt_name,
                        character_maximum_length,
                        numeric_precision,
                        is_nullable,
                        column_default 
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

        let tpl_row = `lv_data.{{column_name}} {{espaco_left}} = fv_jsonb->>'{{column_name}}'; {{espaco_rigth}} --{{ordem}} {{data_type}}`

        let tpl_row_default = `lv_data.{{column_name}} {{espaco_left}} = coalesce((fv_jsonb->>'{{column_name}}')::{{data_type}}, {{column_default}}); {{espaco_rigth}} --{{ordem}} {{data_type}}`

        let rows = columns.map((one: any) => {

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

            let tpl = tpl_row;
            if(one.column_default) {
                tpl = tpl_row_default;
            }

            return tpl.replace(/\{{column_name}}/gi, one.column_name)
                        .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                        .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                        .replace(/\{{ordem}}/gi, ordem)
                        .replace(/\{{data_type}}/gi, data_type)
                        .replace(/\{{column_default}}/gi, one.column_default);
        });

        let j2r_rows = rows.join('\n    ');

        let file_name = this.file_name;
        file_name = file_name.replace('{{table_name}}', model.table.name);
        file_name = file_name.replace('{{sufixo}}', this.sufixo);

        let code = this.templates.map(tpl => {
                            return tpl.replace(/\{{schema_create}}/gi, model.schema_create)
                                    .replace(/\{{table_name}}/gi, model.table.name)
                                    .replace(/\{{table_schema}}/gi, model.table_schema)
                                    .replace(/\{{ano}}/gi, new Date().getFullYear()+'')
                                    .replace(/\{{sufixo}}/gi, this.sufixo)
                                    .replace(/\{{j2r_rows}}/gi, j2r_rows);
                        }).join('\n\n\n----------------------------------------------------');
        

        const source : SourceCode = {
            folder: model.folder,
            file_name,
            code
        };

        return source
    }
}