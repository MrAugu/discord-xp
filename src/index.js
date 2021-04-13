/**
 * Test.
 */
module.exports = {
  /* Classes */
  XpManager: require("./structures/XpManager"),
  Provider: require("./structures/Provider"),
  User: require("./structures/User"),

  /* Util */
  xpFor: require("./utils/calculator").xpFor,
  parseLevel: require("./utils/calculator").parseLevel,

  /* Info */
  version: require("../package.json").version,
  author: require("../package.json").author,
  license: require("../package.json").license
};