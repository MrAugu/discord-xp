const { xpFor, parseLevel } = require("../utils/calculator");
const Provider = require("../structures/Provider");
const XpManager = require("./XpManager");
/**
 * Represents a DiscordXp user.
 */
class User {
  /**
   * The data used to instantiate this user.
   * 
   * @type {object}
   */
  constructor (manager, provider, data) {
    /**
     * The xp manager used to instantiate this.
     * 
     * @type {XpManager}
     */
    this.manager = manager;

    /**
     * The provider whose data was used to instantiate this user.
     * 
     * @type {Provider}
     */
    this.provider = provider;

    /**
     * User's discord id.
     * 
     * @type {string}
     */
    this.id = data.user_id;

    /**
     * User's guild id.
     * 
     * @type {string}
     */
    this.guildID = data.guild_id;

    /**
     * User's xp.
     * 
     * @type {number}
     */
    this.xp = data.xp;

    /**
     * Last updated at.
     * 
     * @type {Date}
     */
    this.lastUpdatedAt = new Date(data.last_updated);

    /**
     * Last updated timestamp.
     * 
     * @type {number}
     */
    this.lastUpdatedTimestamp = data.last_updated;

    /**
     * The user's rank in the leaderboard.
     * 
     * @type {number}
     */
    this.rank = -1;
  }

  /**
   * @returns {number} The level of the user.
   */
  get level () {
    return parseLevel(this.xp);
  }

  /**
   * @returns {number} The amount of xp required to reach the next level of the user.
   */
  get nextLevelXp () {
    return xpFor(this.level + 1);
  }

  get dynamicXp () {
    return this.xp - xpFor(this.level);
  }

  get dynamicNextLevelXp () {
    return xpFor(this.level + 1) - xpFor(this.level);
  }

  /**
   * Fetches the rank of this user.
   * 
   * @returns {number} The rank of this user.
   */
  async fetchRank () {
    let members = await this.provider.getMembersFor(this.guildID);
    members = members.sort((a, b) => a.xp - b.xp);
    this.rank = (members.findIndex((user) => user.user_id === this.id)) + 1;
    return this.rank;
  }

  async appendXp (xp = 1) {
    const oldLevel = this.level;
    await this.provider.updateUser(this.id, this.guildID, this.xp + xp);
    await this.refetch();
    return parseInt(oldLevel, 10) < this.level;
  }

  async refetch () {
    const user = await this.provider.getUser(this.id, this.guildID);
    this.xp = user.xp;
    if (this.rank > -1) await this.fetchRank();
    return;
  }
}

module.exports = User;