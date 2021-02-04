
import { MtaService } from '../mta/mta.service';
import { ScatterService } from '../scatter/scatter.service';
import { InspectService } from '../inspect/inspect.service';

export class InboundService {

    constructor(
        private scatterService: ScatterService, 
        private mtaService: MtaService, 
        private inspectService: InspectService) {}

    async build(all:any) {

        let services = [
            this.scatterService,
            this.mtaService,
            this.inspectService
        ];

        await this.scatterService.buildGeneric(all);

        all.tables.forEach(async (tb : any) => {

            let aux = {...all, table_name: tb.name, segment: tb.segment};
            delete aux.tables;
            services.map(async service => {
                let build = await service.build(aux);
                await service.toFile(build);
            });

        });
    }
}
