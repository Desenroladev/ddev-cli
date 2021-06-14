import { DmlBuilder } from "../builders/dml.builder";
import { DmlModel } from "../models/dml.model";
import { BaseCommand } from "./base.command";

export class DmlCommand extends BaseCommand {

    constructor(private table : string) {
        super();
    }

    async execute(options: any): Promise<any> {
        console.log('table: ', this.table);
        console.log('options: ', options);

        const dml: DmlModel = {
            folder          : options.folder,
            table_catalog   : (process.env.DB_DATABASE || 'default'),
            table_schema    : options.table_schema || 'public',
            schema_create   : (options.schema_create || options.table_schema || 'public'),
            table: {
                name    : this.table,
                pk_type : (options.pk_type || 'uuid'),
                pk_name : (options.pk_name || 'id')
            }
        };

        const builder = new DmlBuilder();
        builder.build([dml]);
    }

}