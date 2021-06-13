import { BaseCommand } from "./base.command";
import * as fs from 'fs';

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

        let folders = folder.split('/');
        folders.push('');

        const reducer = (folder: string, current: string) => {
            if (folder.length > 0 && !fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }
            return folder + '/' + current;
        };

        folders.reduce(reducer);

        sub_folders.map(dir => {
            const path = folder + '/' + dir;

            console.log('Create new folder:', path)
            
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        });
        
    }

}