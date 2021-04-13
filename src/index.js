module.exports = {
  /* Classes */
  Provider: require("./structures/Provider"),
  User: require("./structures/User"),

  /* Providers */
  _providers: {
    "mongodb": require("./providers/mongodb/provider"),
    "json": require("./providers/json/provider")
  },

  /* Util */
  xpFor: require("./utils/calculator").xpFor,
  parseLevel: require("./utils/calculator").parseLevel,

  /* Info */
  version: require("../package.json").version,
  author: require("../package.json").author,
  license: require("../package.json").license
};