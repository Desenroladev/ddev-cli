
import { BaseService } from '../base/base.service';
import * as path from 'path';

export class MergeService extends BaseService {

    tag = 'merge';
  
    template = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(
  fr_data {{table_schema}}.{{table_name}}
) returns {{table_schema}}.{{table_name}}
language plpgsql
as $function$
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_{{table_name}}_{{tag}}: insert or update
------------------------------------------------------------------
declare
  lr_data    {{table_schema}}.{{table_name}};
begin
  if (fr_data.id is not null) then
    lr_data := {{schema_create}}.dmlapi_{{table_name}}_select(fv_id      => fr_data.id,
                                                              fv_locking => true);
    if (lr_data.id is not null) then
      update --+ qb_name(dmlapi_{{table_name}}_merge)
              {{table_schema}}.{{table_name}}
          set 
            {{update_row_data}}
        where 1e1 = 1e1
          and id = lr_data.id
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


`create or replace function {{schema_create}}.dmlapi_{{table_name}}_merge(
  fr_data {{table_schema}}.{{table_name}}[]
) returns jsonb
language plpgsql
as $function$
------------------------------------------------------------------
-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2020 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_{{table_name}}_merge: insert or update collection
------------------------------------------------------------------
declare
  lr_data           {{table_schema}}.{{table_name}};
  lr_count          int;
  lv_erro           jsonb := '{}';
  lv_erros          jsonb := '[]';
begin
  lr_count := 1;
  foreach lr_data in array fr_data loop
    begin
      lr_data := {{schema_create}}.dmlapi_{{table_name}}_merge(fr_data => lr_data);
    exception when others then
      lv_erro := {{schema_create}}.dmlapi_{{table_name}}_r2j(lr_data) || jsonb_build_object('erros',
          jsonb_build_object('code', sqlstate, 'sqlstate', sqlerrm)
      );
      lv_erros := lv_erros || lv_erro;
    end;
  end loop;
  return lv_erros;
exception when others then
raise;
end;
$function$
;`,

`create or replace function {{schema_create}}.dmlapi_{{table_name}}_merge(fr_data jsonb)
returns {{schema_create}}.{{table_name}}
language plpgsql
as $function$
------------------------------------------------------------------
-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright 2020 desenroladev.com.br
------------------------------------------------------------------
-- dmlapi_{{table_name}}_merge: insert or update collection
------------------------------------------------------------------
declare
  lr_data           {{schema_create}}.{{table_name}};
begin
    lr_data := {{schema_create}}.dmlapi_{{table_name}}_j2r(fv_jsonb => fr_data);
    if lr_data.id is null then
      lr_data.id := gen_random_uuid();
    end if;
    return {{schema_create}}.dmlapi_{{table_name}}_merge(fr_data => lr_data);
exception when others then
raise;
end; $function$;`
];


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

    let tpl_update_rows = `{{column_name}} {{espaco_left}} = fr_data.{{column_name}}{{virgula}} {{espaco_rigth}} --{{ordem}} {{data_type}}`

    let update_rows = columns.map((one : any, index: any) => {

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

        return tpl_update_rows.replace(/\{{column_name}}/gi, one.column_name)
                      .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                      .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                      .replace(/\{{ordem}}/gi, ordem)
                      .replace(/\{{data_type}}/gi, data_type)
                      .replace(/\{{virgula}}/gi, columns.length == (index+1) ? ' ':',');
    });

    let merge_update_rows = update_rows.join('\n            ');


    let tpl_into_rows = `{{column_name}}{{virgula}} {{espaco_left}} --{{ordem}} {{data_type}}`
    let into_rows = columns.map((one: any, index: any) => {

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

      return tpl_into_rows.replace(/\{{column_name}}/gi, one.column_name)
                    .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                    .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                    .replace(/\{{ordem}}/gi, ordem)
                    .replace(/\{{data_type}}/gi, data_type)
                    .replace(/\{{virgula}}/gi, columns.length == (index+1) ? ' ':',');
    });

    let merge_into_rows = into_rows.join('\n              ');


    let tpl_values_rows = `fr_data.{{column_name}}{{virgula}} {{espaco_left}} --{{ordem}} {{data_type}}`
    let values_rows = columns.map((one:any, index:any) => {

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

      return tpl_values_rows.replace(/\{{column_name}}/gi, one.column_name)
                    .replace(/\{{espaco_left}}/gi, espaco_left)//coloca 50 espaços a esquerda
                    .replace(/\{{espaco_rigth}}/gi, espaco_rigth)//coloca 50 espaços a direita
                    .replace(/\{{ordem}}/gi, ordem)
                    .replace(/\{{data_type}}/gi, data_type)
                    .replace(/\{{virgula}}/gi, columns.length == (index+1) ? ' ':',');
    });

    let merge_values_rows = values_rows.join('\n              ');

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
                                .replace(/\{{update_row_data}}/gi, merge_update_rows)
                                .replace(/\{{into_row_data}}/gi, merge_into_rows)
                                .replace(/\{{into_values_data}}/gi, merge_values_rows);
                    }).join('\n\n\n----------------------------------------------------\n');
    
    this.codigo = template;

    return {
        file_name,
        codigo: template
    };
  }

}
