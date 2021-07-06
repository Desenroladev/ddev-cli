import { DmlBuilder } from "../builders/dml.builder";
import { DmlModel } from "../models/dml.model";
import { BaseCommand } from "./base.command";
import * as path from 'path';
import { DeployCommand } from "./deploy.command";

export class DmlCommand extends BaseCommand {

    constructor(private table : string) {
        super();
    }

    async execute(options: any): Promise<any> {
        const dml: DmlModel = {
            folder          : options.folder || path.resolve(),
            table_catalog   : (process.env.DB_DATABASE || 'default'),
            table_schema    : options.table_schema || 'public',
            schema_create   : (options.schema_create || options.table_schema || 'public'),
            table: {
                name    : this.table,
                pk_type : (options.pk_type                  || 'uuid'),
                pk_name : (options.pk_name                  || 'id'),
                delete  : !!options.withDeleteSoftware
            }
        };

        const builder = new DmlBuilder();
        await builder.build(dml);

        console.log(`Created DML API from table: ${this.table}`);

        if(options?.deploy) {
            const cmd = new DeployCommand();
            cmd.execute({script: dml.folder});
        }
    }

}