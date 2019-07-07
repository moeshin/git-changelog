const defaults = require('./defaults');

// noinspection JSUnusedLocalSymbols
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
