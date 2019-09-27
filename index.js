const mongoose = require("mongoose");
const levels = require("./models/levels.js");
var mongoUrl;

class DiscordXp {
  async set setURL(dbUrl) {
    if (!dbUrl) throw new TypeError("A database url was not provided.");
    mongoUrl = dbUrl;
    return mognoose.connect(dbUrl, {
      useNewUrlParser: true
    });
  }
}
