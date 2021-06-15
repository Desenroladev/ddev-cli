
import { BaseCommand } from "./base.command";
import * as fs from 'fs';
import { Database } from "../database/database";
import { passThroughOptions } from "commander";

export class DeployCommand extends BaseCommand {

    protected db : Database;
    
    constructor() {
        super();

        this.db = new Database();
    }

    async deploy(file_path: string) {
        const script = fs.readFileSync(file_path).toString();

        console.log(`Deploy script ${file_path}`);
        return await this.db.query(script);
    }

    async execute(options: any): Promise<any> {

        const script = fs.lstatSync(options.script);

        if(script.isDirectory()) {
            fs.readdir(options.script, (err, filenames) => {
                if(err) {
                    throw err;
                }
                filenames.forEach(async(file) => {
                    const file_path = `${options.script}/${file}`;
                    await this.deploy(file_path);
                });
            });
        } else {
            await this.deploy(options.script);
        }

    }

}