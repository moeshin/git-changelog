'use strict';

const conventionalChangelog = require('conventional-changelog');
const defaults = require('./defaults');
const errors = require('./lib/errors');
const fs = require('fs');
const resolve = require('path').resolve;
const utils = require("./lib/utils");
const yargs = require("yargs");
const _ = require("lodash");
const ArgvError = errors.ArgvError;

/**
 * @param {Argv} argv
 */
function gitChangelog(argv) {

    // noinspection HtmlDeprecatedAttribute
    const LOG_START_ANCHOR = '<a name="log"></a>\n';
    const LOG_START_PATTERN = new RegExp(`^${LOG_START_ANCHOR}`, 'm');

    let oldLog = fs.existsSync(argv.log) ? fs.readFileSync(argv.log, utils.encoding) : '';
    if (oldLog) {
        if (argv.force) {
            oldLog = '';
        } else {
            const oldLogStart = oldLog.search(LOG_START_PATTERN);
            if (oldLogStart !== -1) {
                oldLog = oldLog.substring(oldLogStart + LOG_START_ANCHOR.length);
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
        throw new ArgvError('Missing required argument: release version');
    }


    /* Set default */
    if (!argv.header) {
        argv.header = config.header || defaults.header;
    }
    delete config.header;

    const gitRawCommitsOpts = config.gitRawCommitsOpts || {};

    if (argv.commitPath) {
        gitRawCommitsOpts.path = argv.commitPath;
    }


    let log = '';
    let gitSemverTagsIndex = 0;

    // noinspection HtmlDeprecatedAttribute
    const LOG_ITEM_START_ANCHOR = '<a name="%s"></a>';
    function logItemStartAnchor(version) {
        return LOG_ITEM_START_ANCHOR.replace(/%s/g, version);
    }
    function logItemStartPattern(version) {
        return new RegExp(`^${logItemStartAnchor(version)}$`, 'm');
    }
    function logItem(version, string) {
        return logItemStartAnchor(templateContext.version) + '\n' + string;
    }

    /** @type {NodeJS.ReadableStream} */
    const readableStream = conventionalChangelog(options, templateContext, gitRawCommitsOpts,
        config.parserOpts, config.writerOpts);
    readableStream
        .on('errors.js', e => {
            if (argv.verbose) {
                console.error(e.stack)
            } else {
                console.error(e.toString())
            }
            process.exit(1)
        })
        .on('data', buffer => {
            const string = buffer.toString().replace(/\n+$/, '\n\n');
            if (!log) {
                log = logItem(templateContext.version, string);
            } else {
                log += logItem(templateContext.gitSemverTags[gitSemverTagsIndex++], string);
            }
        })
        .on('end', () => {
            if (oldLog) {
                if (oldLog.search(logItemStartPattern(templateContext.version)) !== -1) {
                    if (templateContext.gitSemverTags.length) {
                        let search = logItemStartPattern(templateContext.gitSemverTags[0]);
                        const start = oldLog.search(search);
                        if (start !== -1) {
                            oldLog = oldLog.substring(start + search.length);
                        }
                    } else {
                        oldLog = '';
                    }
                }
            }
            fs.writeFileSync(argv.log, argv.header + '\n' + LOG_START_ANCHOR + log + oldLog);
        });
}

module.exports = gitChangelog;