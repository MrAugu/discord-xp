const mongoose = require("mongoose");
const levels = require("./models/levels.js");
var mongoUrl;

class DiscordXp {

  /**
  * @param {string} [dbUrl] - A valid mongo database URI.
  */

  async static setURL(dbUrl) {
    if (!dbUrl) throw new TypeError("A database url was not provided.");
    mongoUrl = dbUrl;
    return mognoose.connect(dbUrl, {
      useNewUrlParser: true
    });
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

  async static createUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isUser = await levels.findOne({ userID: userId, guildID: guildId });
    if (isUser) return false;

    const newUser = new levels({
      userID: userId,
      guildID: guildId
    });

    await newUser.save().catch(e => console.log(`Failed to create user: ${e}`));

    return newUser;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

  async static deleteUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    await levels.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`))

    return user;
  }
}
