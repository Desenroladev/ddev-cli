
import { BaseService } from '../base/base.service';
import * as path from 'path';

export class J2rService extends BaseService {

    tag = 'j2r';

    template = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(
    fv_jsonb jsonb
)
returns {{table_schema}}.{{table_name}}
language plpgsql
as $function$
------------------------------------------------------------------
-- LIVNOW: LIV Noop Of Work
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- {{table_schema}}.{{table_name}}: jsonb to record
------------------------------------------------------------------
declare
    lr_data             {{table_schema}}.{{table_name}};
    lr_empty            {{table_schema}}.{{table_name}};
    lr_data_inclusao    varchar;
    lv_data             {{table_schema}}.{{table_name}};
begin
    ------------------------------------------------------------
    lr_data_inclusao := '"'||coalesce(cast(fv_jsonb->>'data_inclusao' as timestamp), clock_timestamp())||'"';
    select jsonb_set(fv_jsonb, '{"data_inclusao"}', lr_data_inclusao::jsonb) into fv_jsonb;
    ------------------------------------------------------------
    if fv_jsonb->>'pessoa_source_id' is not null then                                                              --009 uuid
        select 
            jsonb_set(fv_jsonb, '{"pessoa_id"}', ('"'||p.id||'"')::jsonb) into fv_jsonb
        from livnow.livnow_pessoa p 
        where p.source_id = fv_jsonb->>'pessoa_source_id';                        
    end if;
    ------------------------------------------------------------
    {{j2r_rows}}
    return lv_data;
end;
$function$;`];



    formartaComZero(numero:Number, casas=3) {

        let txt = ''+numero;
        for(let i = 0; i < (casas - (''+numero).length); i++) {
            txt = '0'+txt;
        }

        return txt;
    }

    gerarEspacos(column_name: any, max_length=40) {

        let i = 0;
        let count  = (max_length - column_name.length);
        let espaco = '';
        while(i++ < count) {
            espaco += ' ';
        }

        return espaco;
    }

    async build(data: any) : Promise<any> {
        
        let resolve = path.resolve('/');
        this.folder_file = data.folder_file || resolve;

        const sql = `select 
                        column_name, 
                        ordinal_position,
                        data_type,
                        udt_name,
                        character_maximum_length,
                        numeric_precision,
                        is_nullable
                    from information_schema.columns 
                    where table_name = :table_name
                        and table_schema = :table_schema
                        and table_catalog = :table_catalog
                    order by ordinal_position`;

        const columns = await this.db.query(sql, data);

        let tpl_row = `lv_data.{{column_name}} {{espaco_left}} = fv_jsonb ->> '{{column_name}}'; {{espaco_rigth}} --{{ordem}} {{data_type}}`

        let rows = columns.map((one: any) => {

            let espaco_left = this.gerarEspacos(one.column_name);
            
            let espaco_rigth = this.gerarEspacos(one.column_name);
            
            let ordem = this.formartaComZero(one.ordinal_position, 3);
            let data_type = one.data_type;

            if(one.character_maximum_length > 0) {
                data_type += `(${one.character_maximum_length})`;
            }

            if(one.is_nullable == 'YES') {
                data_type += ` not null`;
            }

            return tpl_row.replace(/\{{column_name}}/gi, one.column_name)
                          .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                          .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                          .replace(/\{{ordem}}/gi, ordem)
                          .replace(/\{{data_type}}/gi, data_type);
        });

        let j2r_rows = rows.join('\n    ');

        let file_name = this.file_name;
        file_name = file_name.replace('{{schema_create}}', data.schema_create);
        file_name = file_name.replace('{{table_name}}', data.table_name);
        file_name = file_name.replace('{{tag}}', this.tag);

        let template = this.template.map(tpl => {
                            return tpl.replace(/\{{schema_create}}/gi, data.schema_create)
                                    .replace(/\{{table_name}}/gi, data.table_name)
                                    .replace(/\{{table_schema}}/gi, data.table_schema)
                                    .replace(/\{{ano}}/gi, new Date().getFullYear()+'')
                                    .replace(/\{{tag}}/gi, this.tag)
                                    .replace(/\{{j2r_rows}}/gi, j2r_rows);
                        }).join('\n\n\n----------------------------------------------------');
        
       
        this.codigo = template;

        return {
            file_name,
            codigo: template
        };
    }

}
