const fs = require('fs');
const Path = require('path');
const _ = require("lodash");

const __parent__dirname = Path.dirname(module.parent.filename);

const utils = {
    encoding: 'utf8',
    test: function() {
        console.log(Path.join(__parent__dirname, 'E:\\Projects\\Scripts\\standard-version\\test.js'));
    },
    path: function(path) {
        if (!_.isString(path)) {
            throw "Path is not string";
        }
        if (Path.isAbsolute(path)) {
            return path;
        } else {
            return Path.join(__parent__dirname, path);
        }
    },
    read: function(path) {
        return fs.readFileSync(this.path(path), this.encoding);
    },
    write: function(path, data) {
        return fs.writeFileSync(this.path(path), data);
    }
};

module.exports = utils;