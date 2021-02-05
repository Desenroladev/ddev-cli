import { BaseCommand } from "./base.command";
import * as fs from 'fs';

export class NewCommand extends BaseCommand {

    async execute(options: any) : Promise<any> {

        const folder = options.trim();

        console.log('Create new project:', folder);

        const folders = [
            'views',
            'plpgsql',
            'tables',
            'types'
        ];
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }

        folders.map(dir => {
            const path = folder + '/' + dir;

            console.log('Create new folder:', path)
            
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        });

        const env_path =  `${folder}/.env`;
        fs.appendFileSync(env_path, `DB_URL=127.0.0.1\n`);
        fs.appendFileSync(env_path, `DB_DATABASE=${folder}\n`);
        fs.appendFileSync(env_path, `DB_USER=${folder}\n`);
        fs.appendFileSync(env_path, `DB_PASSWORD=${folder}\n`);
        fs.appendFileSync(env_path, `DB_PORT=5432\n`);
    }

}