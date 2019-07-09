const utils = require('./lib/utils');

module.exports = {
  message: "chore(release): %s",
  log: "CHANGELOG.md",
  notes: "RELEASE-NOTES.md",
  preset: "angular",
  header: utils.read('templates/log-header.txt').toString()
};
