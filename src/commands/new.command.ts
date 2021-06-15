import { File } from "../core/file";
import { BaseCommand } from "./base.command";


export class NewCommand extends BaseCommand {

    async execute(options: any) : Promise<any> {

        const folder = options.trim();

        console.log('Create new project:', folder);

        const sub_folders = [
            'views',
            'plpgsql',
            'tables',
            'types',
            'triggers',
            'scripts'
        ];

        sub_folders.map(dir => {
            const path = folder + '/' + dir;

            console.log('Create new folder:', path)
            
            if (!File.exists(path)) {
                File.mkdir(path);
            }
        });
        
    }

}