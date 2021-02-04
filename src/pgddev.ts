#!/usr/bin/env node

import program from 'commander';
import {Database} from './database/database';
import {NewCommand} from './commands/new.command';

program.version('1.0.0');

program
    .command('g [command]')
    .option('-t, --table <table>')
    .option('-s, --schema <schema>')
    .option('-f, --folder <folder>')
    .description('Create DML')
    .action(async(options, flags) => {

        console.log('options: ', options);
        console.log('flags: ', flags);

        const db = new Database();
        //const connection = await db.getConnection();
        //await connection.start();
        const rows = await db.query('select now()');

        console.log(rows);

        //await connection.release();
    });

program
    .command('new [project]')
    .description('Create new Project')
    .action((project) => {
        const cmd = new NewCommand();
        cmd.execute(project)
    });

program.parse(process.argv);