#!/usr/bin/env node

import program from 'commander';
import {Database} from './database/database';
import {NewCommand} from './commands/new.command';

program.version('1.0.1');

program
    .command('g [command]')
    .option('-t, --table <table>')
    .option('-s, --schema <schema>')
    .option('-f, --folder <folder>')
    .description('Create DML')
    .action(async(command, options) => {

        console.log('command: ', command);
        console.log('options: ', options);

        const db = new Database();
        //const connection = await db.getConnection();
        //await connection.start();
        const rows = await db.query('select now()');

        console.log(rows);

        //await connection.release();
    });

program
    .command('new [project]')
    .option('-p, --project <project>')
    .option('-s, --schema <schema>')
    .description('Create new Project')
    .action((command: string, options: string) => {
        console.log(command, options);
        const cmd = new NewCommand();
        cmd.execute(command)
    });

program.parse(process.argv);