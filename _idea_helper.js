const defaults = require('./defaults');

function Argv() {

    /** @type {String} */
    this.releaseVersion = undefined;

    /** @type {String} */
    this.message = defaults.message;

    /** @type {boolean} */
    this.force = false;

    /** @type {String} */
    this.log = defaults.log;

    /** @type {String} */
    this.header = defaults.header;

    /** @type {String} */
    this.footer = undefined;

    /** @type {String|boolean} */
    this.notes = undefined;

    /** @type {String} */
    this.preset = defaults.preset;

    /** @type {String} */
    this.pkg = undefined;

    /** @type {boolean} */
    this.verbose = false;

    /** @type {String} */
    this.config = undefined;

    /** @type {String} */
    this.context = undefined;

    /** @type {String} */
    this.lernaPackage = undefined;

    /** @type {String} */
    this.tagPrefix = undefined;

    /** @type {String} */
    this.commitPath = undefined;
}

/**
 * Variables that will be interpolated to the template
 *
 * @link https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#user-content-context
 */
function TemplateContext() {

    /** @type {String} */
    this.version = undefined;

    /** @type {Array} */
    this.gitSemverTags = undefined;

    /** @type {String} */
    this.title = undefined;

    /** @type {boolean} */
    this.isPatch = undefined;

    /** @type {String} */
    this.host = undefined;

    /** @type {String} */
    this.owner = undefined;

    /** @type {String} */
    this.repository = undefined;

    /** @type {String} */
    this.repoUrl = undefined;

    /** @type {boolean} */
    this.linkReferences = true;

    /** @type {String} */
    this.commit = 'commits';

    /** @type {String} */
    this.issue = 'issues';

    /** @type {String} */
    this.date = undefined;
}

function Config() {

    /** @type {String} */
    this.header = undefined;

    /** @type {Object} */
    this.gitRawCommitsOpts = undefined;

    /** @type {String} */
    this.parserOpts = undefined;

    /** @type {String} */
    this.writerOpts = undefined;

    /** @type {String} */
    this.header = undefined;
}