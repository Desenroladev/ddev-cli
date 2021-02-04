import { BaseCommand } from "./base.command";

export class NewCommand extends BaseCommand {

    async execute(options: any) : Promise<any> {
        console.log('Create new project:', options.trim());
    }

}