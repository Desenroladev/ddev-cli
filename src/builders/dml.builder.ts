import { DmlModel } from "../models/dml.model";
import { J2RBuilder } from "./j2r.builder";
import { MergeBuilder } from "./merge.builder";
import { PurgeBuilder } from "./purge.builder";
import { R2JBuilder } from "./r2j.builder";
import { SelectBuilder } from "./select.builder";

export class DmlBuilder {

    build(all: DmlModel[]) {

        let builders = [
            new J2RBuilder(),
            new R2JBuilder(),
            new SelectBuilder(),
            new PurgeBuilder(),
            new MergeBuilder()
        ];
            
        all.forEach((dml: DmlModel) => {
            builders.map(async builder => {
                if(!dml.table?.pk_name) {
                    dml.table.pk_name = 'id';
                }
                if(!dml.table?.pk_type) {
                    dml.table.pk_type = 'uuid';
                }
                let source = await builder.build(dml);
                await builder.write(source);
            });
        });
        
    }

}