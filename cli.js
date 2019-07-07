#!/usr/bin/env node

'use strict';

const defaults = require('./defaults');
const errors = require('./lib/errors');
const gitChangelog = require('./index');
const ArgvError = errors.ArgvError;

// noinspection JSUnresolvedFunction
const yargs = require('yargs').usage('Usage: $0 [options]');
yargs.option('release-version', {
    alias: 'r',
    describe: 'Specify the release version manually',
    string: true
}).option('message', {
    alias: 'm',
    describe: 'Commit message, replaces %s with new version',
    default: defaults.message,
    string: true
}).option('force', {
    alias: 'f',
    describe: 'Forced to regenerate log',
    default: false,
    boolean: true
}).option('log', {
    describe: 'Changelog file name',
    default: defaults.log,
    string: true
}).option('header', {
    describe: 'The header of log. You also can set it with --config\nDefault is the content of templates/log-header.txt',
    string: true
}).option('notes', {
    describe: 'Release notes file name\nIf no use，it no output. Default is RELEASE-NOTES.md',
}).option('preset', {
    alias: 'p',
    default: defaults.preset,
    describe: 'Commit message guideline preset',
    string: true
}).option('pkg', {
    alias: 'k',
    describe: 'A filepath of where your package.json is located\nDefault is the closest package.json from cwd',
    string: true
}).option('verbose', {
    alias: 'V',
    describe: 'Verbose output. Use this for debugging',
    default: false,
    boolean: true
}).option('config', {
    alias: 'n',
    describe: 'A filepath of your config script\nExample of a config script: https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/index.js',
    string: true
}).option('context', {
    alias: 'c',
    describe: 'A filepath of a json that is used to define template variables',
    string: true
}).option('lerna-package', {
    alias: 'l',
    describe: 'Generate a log for a specific lerna package (:pkg-name@1.0.0)',
    string: true
}).option('tag-prefix', {
    alias: 't',
    describe: 'Tag prefix to consider when reading the tags',
    string: true
}).option('commit-path', {
    alias: 'cp',
    describe: 'Generate a log scoped to a specific directory',
    string: true
}).alias('help', 'h')
    .alias('help', '?')
    .alias('version', 'v');

/** @type {Argv} */
const argv = yargs.argv;

try {
    gitChangelog(argv);
} catch (e) {
    if (e.name === ArgvError.name) {
        yargs.showHelp();
        console.error(e.message);
        if (e.message === 'Missing required argument: release version') {
            console.error(`
1. You can set it by command argument
Example: -r 1.0.0

2. You can set in context, and set it by command argument
Example: -c context.json 
And here must have a context.json, it maybe is {"version":"1.0.0"}

3. You can set it in package.json
`);
            process.exit(1);
        }
    }
}
