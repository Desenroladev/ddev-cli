#!/usr/bin/env node

const program = require('commander');
const db = require('./src/database/database');


const package = require('./package.json');

program.version(package.version);

program
    .command('g [command]')
    .option('-t, --table <table>')
    .option('-s, --schema <schema>')
    .option('-f, --folder <folder>')
    .description('Create DML')
    .action(async(options, flags) => {

        console.log('options: ', options);
        console.log('flags: ', flags);

        const connection = await db.getConnection();
        await connection.start();
        const rows = await connection.query('select now()');

        //console.log(rows);

        await connection.commit();
    });


program
    .command('new [project]')
    .description('Create new Project')
    .action((project) => {
        console.log(project);
    });

program.parse(process.argv);