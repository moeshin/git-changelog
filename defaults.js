const utils = require('./lib/utils');

module.exports = {
  log: "CHANGELOG.md",
  notes: "RELEASE-NOTES.md",
  preset: "angular",
  header: utils.read('templates/header.md').toString()
};
