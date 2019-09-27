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

    await levels.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`));

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [xp] - Amount of xp to append.
  */

  async static appendXp(userId, guildId, xp) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!xp) throw new TypeError("An amount of xp was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    user.xp += xp;

    user.save().catch(e => console.log(`Failed to append xp: ${e}`) );

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [levels] - Amount of levels to append.
  */

  async static appendLevel(userId, guildId, levels) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!levels) throw new TypeError("An amount of levels was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    user.level += levels;

    user.save().catch(e => console.log(`Failed to append level: ${e}`) );

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [xp] - Amount of xp to set.
  */

  async static setXp(userId, guildId, xp) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!xp) throw new TypeError("An amount of xp was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    user.xp = xp;

    user.save().catch(e => console.log(`Failed to set xp: ${e}`) );

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [level] - A level to set.
  */

  async static setLevel(userId, guildId, level) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!level) throw new TypeError("A level was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    user.level = level;

    user.save().catch(e => console.log(`Failed to set level: ${e}`) );

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

  async static fetch(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [xp] - Amount of xp to subtract.
  */

  async static subtractXp(userId, guildId, xp) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!xp) throw new TypeError("An amount of xp was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    user.xp -= xp;

    user.save().catch(e => console.log(`Failed to subtract xp: ${e}`) );

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [levels] - Amount of levels to subtract.
  */

  async static subtractLevel(userId, guildId, levels) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!levels) throw new TypeError("An amount of levels was not provided.");

    const user = await levels.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    user.level -= levels;

    user.save().catch(e => console.log(`Failed to subtract levels: ${e}`) );

    return user;
  }

  /**
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [limit] - Amount of maximum enteries to return.
  */


  async static fetchLeaderboard(guildId, limit) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!limit) throw new TypeError("A limit was not provided.");

    const users = await levels.find({ guildID: guildId });

    return users.slice(0, limit);
  }

  /**
  * @param {string} [client] - Your Discord.CLient.
  * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
  */

  static computeLeaderboard(client, leaderboard) {
    if (!client) throw new TypeError("A client was not provided.");
    if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");

    if (leaderboard.length < 1) return [];

    const computedArray = [];

    leaderboard.map(key => {
      computedArray.push({
        guildID: key.guildID,
        userID: key.userID,
        xp: key.xp,
        level: key.level,
        position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1)
      });
    });
  }

}
