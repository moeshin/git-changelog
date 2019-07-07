#!/usr/bin/env node

'use strict';

const standardVersion = require('./index');
const defaults = require('./defaults');
const _ = require('lodash');
const resolve = require('path').resolve;
const fs = require('fs');
const utils = require("./lib/utils");

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

// noinspection HtmlDeprecatedAttribute
const LOG_START_ANCHOR = '<a name="log"></a>';
const LOG_START_PATTERN = new RegExp(`^${LOG_START_ANCHOR}$`, 'm');
const LOG_START_OFFSET = LOG_START_ANCHOR.length;

let oldLog = fs.existsSync(argv.log) ? fs.readFileSync(argv.log, utils.encoding) : '';
if (oldLog) {
    if (argv.force) {
        oldLog = '';
    } else {
        const oldLogStart = oldLog.search(LOG_START_PATTERN);
        if (oldLogStart !== -1) {
            oldLog = oldLog.substring(oldLogStart + LOG_START_OFFSET);
        }
    }
} else {
    argv.force = true;
}

const options = _.omit({
    preset: argv.preset,
    pkg: {
        path: argv.pkg
    },
    releaseCount: argv.force ? 0 : 1,
    lernaPackage: argv.lernaPackage,
    tagPrefix: argv.tagPrefix
}, _.isUndefined);

if (argv.verbose) {
    options.debug = console.info.bind(console);
    options.warn = console.warn.bind(console);
}

let templateContext = {};
let config = {};

/* Read config */
try {
    if (argv.context) {
        templateContext = require(resolve(process.cwd(), argv.context));
    }

    if (argv.config) {
        config = require(resolve(process.cwd(), argv.config));
        options.config = config
    }
} catch (err) {
    console.error('Failed to get file. ' + err);
    process.exit(1)
}

/* Check release version */
if (argv.releaseVersion) {
    templateContext.version = argv.releaseVersion;
} else {
    const pkg = argv.pkg || './package.json';
    if (fs.existsSync(pkg)) {
        let version = require(pkg).version;
        if (version) {
            templateContext.version = version;
        }
    }
}

if (!templateContext.version) {
    yargs.showHelp();
    console.error(`Missing required argument: release version

1. You can set it by command argument
Example: -r 1.0.0

2. You can set in context, and set it by command argument
Example: -c context.json 
And here must have a context.json, it maybe is {"version":"1.0.0"}

3. You can set it in package.json
`);
    process.exit(1);
}


/* Set default */
if (!argv.header) {
    argv.header = config.header || defaults.header;
}
delete config.header;

const gitRawCommitsOpts = _.merge({
    path: argv.commitPath,
}, config.gitRawCommitsOpts);

const writerOpts = _.merge({
    headerPartial: utils.read('templates/header.hbs')
}, config.writerOpts);


let log = '';
let notes = '';

standardVersion(options, templateContext, gitRawCommitsOpts, config.parserOpts, writerOpts)
    .on('error', e => {
        if (argv.verbose) {
            console.error(e.stack)
        } else {
            console.error(e.toString())
        }
        process.exit(1)
    })
    .on('data', buffer => {
        const string = buffer.toString().replace(/\n+$/, '\n');
        if (!notes) {
            log = notes  = string;
        } else {
            log += string;
        }
    })
    .on('end', () => {
        fs.writeFileSync(argv.log, argv.header + '\n' + LOG_START_ANCHOR + '\n\n' + log + oldLog);
    });
