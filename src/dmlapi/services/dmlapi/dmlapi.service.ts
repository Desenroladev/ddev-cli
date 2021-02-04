
import { C2jService } from '../c2j/c2j.service';
import { J2cService } from '../j2c/j2c.service';
import { J2rService } from '../j2r/j2r.service';
import { MergeService } from '../merge/merge.service';
import { PurgeService } from '../purge/purge.service';
import { R2jService } from '../r2j/r2j.service';
import { SelectService } from '../select/select.service';

export class DMLApiService {

    constructor(
        private c2jService: C2jService,
        private j2cService: J2cService,
        private j2rService: J2rService,
        private mergeService: MergeService,
        private purgeService: PurgeService,
        private r2jService: R2jService,
        private selectService: SelectService
    ) {}

    build(all:any) {

        let cruds = [
            this.c2jService,
            this.j2cService,
            this.j2rService,
            this.mergeService,
            this.purgeService,
            this.r2jService,
            this.selectService,

        ];
        all.tables.forEach(async (tb: any) => {

            let aux = {...all, table_name: tb.name};
 
            delete aux.tables;
            
            cruds.map(async service => {
                let build = await service.build(aux);
                await service.toFile(build);
            });

        });

    }

}
