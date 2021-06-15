#!/usr/bin/env node

import program from 'commander';
import dotenv from 'dotenv';

import { NewCommand } from './commands/new.command';
import { DmlCommand } from './commands/dml.command';
import { DeployCommand } from './commands/deploy.command';

dotenv.config();

program.version('1.0.4');

program
    .command('dml [table]')
    .option('-s, --table_schema <table_schema>')
    .option('-c, --schema_create <schema_create>')
    .option('-f, --folder <folder>')
    .option('-p, --pk_name <pk_name>')
    .option('-t, --pk_type <pk_type>')
    .option('-d --deploy')
    .description('Create DML API')
    .action(async(command, options) => {
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