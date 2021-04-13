const providers = {
  "mongodb": require("./../providers/mongodb/provider"),
  "json": require("./../providers/json/provider")
};

const supportedProviders = Object.keys(providers);
const { Provider } = require("../structures/Provider");

class XpManager {
  constructor (provider, options) {
    if (!provider || !supportedProviders.includes(provider.toLowerCase())) throw new Error(`You must specify a storage provider name, currently supporting \`${supportedProviders.join("`, `")}\`.`);
    if (!options) throw new Error("You need to specify the provider options.");

    /**
     * The provider for this manager.
     * 
     * @type {Provider} 
     */
    this.provider = new providers[provider.toLowerCase()](options);
    setTimeout(() => console.log(this.provider), 5000);
  }
}

module.exports = XpManager;