const { Provider } = require("../structures/Provider");
const providers = {
  "mongodb": require("./../providers/mongodb/provider"),
  "json": require("./../providers/json/provider")
};
const User = require("../structures/User");

/**
 * @typedef {object} mongodbProviderOptions
 * @property {string} url - The a valid mongodb database url.
 */

/**
 * @typedef {object} jsonProviderOptions
 * @property {string} fileName - A json file name for the json storage
 * @property {string} path - The path to the `fileName`, usually `__dirname`.
 */

/**
 * Represents an instance of discorrd xp. 
 */
class XpManager {
  /**
   * @param {string} provider - The name of the provider, currently supporting `mongodb` and `json`. 
   * @param {mongodbProviderOptions|jsonProviderOptions} options - The options for your specific provider. 
   */
  constructor (provider, options) {
    if (!provider || !Object.keys(providers).includes(provider.toLowerCase())) throw new Error(`You must specify a storage provider name, currently supporting \`${Object.keys(providers).join("`, `")}\`.`);
    if (!options) throw new Error("You need to specify the provider options.");

    /**
     * The provider for this manager.
     * 
     * @type {Provider} 
     */
    this.provider = new providers[provider.toLowerCase()](options);
  }

  /**
   * Fetches the user from database and returns an instance of user client.
   * 
   * @param {string} id - The id of the user you want to fetch.
   * @param {string} guildID - The guild user is a member of.
   * @returns {Promise<User|null>} Returns an user object or nothing.
   */
  fetch (id, guildID) {
    return new Promise((resolve, reject) => {
      this.provider.getUser(id, guildID).then((user) => {
        console.log(user);
        if (!user) resolve(null);
        else resolve(new User(this, this.provider, user));
      }).catch(reject);
    });
  }

  /**
   * It adds another user to the database.
   * 
   * @param {string} id - The id of the user.
   * @param {string} guildID - The guild id the user is in.
   * @param {number} xp - The amount of xp to set the user, default to 0.
   * @returns {boolean} Whether or not the user has been created.
   */
  create (id, guildID, xp = 0) {
    return new Promise((resolve, reject) => {
      this.provider.createUser(id, guildID, xp).then(resolve).catch(reject);
    });
  }

  /**
   * Fetches the user or creates it and then fetches it.
   * 
   * @param {*} id - The id of the user.
   * @param {*} guildID - The id of the guild user is in.
   * @param {*} xp - The initial amount of xp to set.
   * @returns {User} The user returned.
   */
  async fetchOrCreate (id, guildID, xp = 0) {
    const user = await this.fetch(id, guildID);
    if (!user) await this.create(id, guildID, xp);
    return await this.fetch(id, guildID);
  }
}

module.exports = XpManager;