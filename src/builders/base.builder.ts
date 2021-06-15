
import * as fs from 'fs';
import * as path from 'path';
import { File } from '../core/file';
import { Database } from "../database/database";
import { DmlModel } from '../models/dml.model';
import { SourceCode } from '../models/source-code.model';

export class BaseBuilder {

    protected file_name       : string    = `dmlapi_{{table_name}}_{{sufixo}}.sql`;
    protected db              : Database;

    constructor(
        protected sufixo    : string, 
        protected templates : string[]
    ) {
        this.db = new Database();
    }

    formatWithZero(number:number, houses: number=3) {
        let txt = ''+number;
        for(let i = 0; i < (houses - (''+number).length); i++) {
            txt = '0'+txt;
        }
        return txt;
    }

    generateSpaces(column_name: string, max_length: number=40) {
        let i = 0;
        let count  = (max_length - column_name.length);
        let espaco = '';
        while(i++ < count) {
            espaco += ' ';
        }
        return espaco;
    }

    async build(model: DmlModel) : Promise<SourceCode> {

        let file_name = this.file_name;
        file_name = file_name.replace('{{table_name}}', model.table.name);
        file_name = file_name.replace('{{sufixo}}', this.sufixo);

        const code = this.templates.map(tpl => {
                                return tpl.replace(/\{{schema_create}}/gi,  model.schema_create)
                                        .replace(/\{{table_name}}/gi,       model.table.name)
                                        .replace(/\{{table_schema}}/gi,     model.table_schema)
                                        .replace(/\{{sufixo}}/gi,           this.sufixo)
                                        .replace(/\{{pk_type}}/gi,          (model.table.pk_type || 'uuid') )
                                        .replace(/\{{pk_name}}/gi,          (model.table.pk_name || 'id') )
                                        .replace(/\{{ano}}/gi,              new Date().getFullYear()+'');
                            })
                            .join('\n-------------------------------------------------------------------\n');

        const source : SourceCode = {
            folder: model.folder,
            file_name,
            code
        };

        return source
    }

    async write(source: SourceCode) {
        
        if(!File.exists(source.folder)) {
            File.mkdir(source.folder);
        }
        
        const path_file = `${source.folder}/${source.file_name}`;

        fs.writeFile( path.resolve(path_file), source.code, function(err) {
            if(err) {
                throw err;
            }
        });
    }

}