'use strict';

const conventionalChangelog = require('conventional-changelog');

/** @return {NodeJS.ReadableStream} */
function StandardVersion(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
    return conventionalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts);
}

module.exports = StandardVersion;