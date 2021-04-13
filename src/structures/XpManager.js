const { Provider } = require("../structures/Provider");
const providers = {
  "mongodb": require("./../providers/mongodb/provider"),
  "json": require("./../providers/json/provider")
};
const User = require("../structures/User");

class XpManager {
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

  fetch (id, guildID) {
    return new Promise((resolve, reject) => {
      this.provider.getUser(id, guildID).then((user) => {
        console.log(user);
        if (!user) resolve(null);
        else resolve(new User(this, this.provider, user));
      }).catch(reject);
    });
  }

  create (id, guildID, xp = 0) {
    return new Promise((resolve, reject) => {
      this.provider.createUser(id, guildID, xp).then(resolve).catch(reject);
    });
  }

  async fetchOrCreate (id, guildID, xp = 0) {
    const user = await this.fetch(id, guildID);
    if (!user) await this.create(id, guildID, xp);
    return await this.fetch(id, guildID);
  }
}

module.exports = XpManager;