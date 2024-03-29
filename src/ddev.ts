#!/usr/bin/env node

import program from 'commander';
import dotenv from 'dotenv';

import { NewCommand } from './commands/new.command';
import { DmlCommand } from './commands/dml.command';
import { DeployCommand } from './commands/deploy.command';
import path from 'path';

dotenv.config();

program.version('2.0.6');

program
    .command('dml [table]')
    .option('-s, --table_schema <table_schema>')
    .option('-c, --schema_create <schema_create>')
    .option('-f, --folder <folder>')
    .option('-p, --pk_name <pk_name>')
    .option('-t, --pk_type <pk_type>')
    .option('-d, --deploy')
    .option('-w, --with-delete-software')    
    .option('-e, --enviroment <env>')
    .description('Create DML API')
    .action(async(command, options) => {
        if(options.enviroment) {
            const env = dotenv.config({path: path.resolve(options.enviroment)});
            process.env = env.parsed || {};
        }
        const dml = new DmlCommand(command);
        dml.execute(options);
    });

program
    .command('new [project]')
    .description('Create Struct Project')
    .action((command: string, options: string) => {
        const cmd = new NewCommand();
        cmd.execute(command);
    });

program
    .command('deploy [script]')
    .description('Deploy Script')
    .action((script: string, options: string) => {
        const cmd = new DeployCommand();
        cmd.execute({script});
    });

program.parse(process.argv);