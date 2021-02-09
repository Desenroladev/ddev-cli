

import * as fs from 'fs';
import * as path from 'path';
import { Database } from "../../../database/database";

export class BaseService {

    protected db: Database;
    protected template: string[] = [];

    protected folder_file: string = '';

    protected file_name: string = `dmlapi_{{table_name}}_{{tag}}.sql`;
    protected code: string = '';
    protected tag: string = '';
    
    constructor() {
        this.db = new Database();
    }

    async build(data: any) : Promise<any> {

        let resolve = path.resolve('/');
        this.folder_file = data.folder_file || resolve;

        let file_name = this.file_name;
        file_name = file_name.replace('{{schema_create}}', data.schema_create);
        file_name = file_name.replace('{{table_name}}', data.table_name);
        file_name = file_name.replace('{{tag}}', this.tag);

        this.code = this.template.map(tpl => {
                            return tpl.replace(/\{{schema_create}}/gi, data.schema_create)
                                    .replace(/\{{table_name}}/gi, data.table_name)
                                    .replace(/\{{schema_data}}/gi, data.schema_data)
                                    .replace(/\{{tag}}/gi, this.tag)
                                    .replace(/\{{segment}}/gi, (data.segment || '') )
                                    .replace(/\{{ano}}/gi, new Date().getFullYear()+'');
                        }).join('\n-------------------------------------------------------------------\n');
        
        return {
            file_name,
            code: this.code
        };
    }

    async toFile(build: any) {

        let {file_name, code} = build;
        
        file_name = file_name || this.file_name;

        code = code || this.code;
        
        const path_file = `${this.folder_file}/${file_name}`;

        fs.writeFile( path.resolve(path_file), code, function(err) {
            if(err) {
                throw err;
            }
        });
    }

}
