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
   * @param {XpManager} manager - The manager used to instantiate this class.
   * @param {Provider} provider - The provider used to instantiate this class.
   * @param {object} data - The database entry data for this user.
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
   * @example
   * console.log(user.nextLevelXp); // 400
   */
  get nextLevelXp () {
    return xpFor(this.level + 1);
  }

  /**
   * The amount of xp earned since the last level up.
   * 
   * @returns {number} The amount of xp earned since the last level up.
   */
  get dynamicXp () {
    return this.xp - xpFor(this.level);
  }

  /**
   * The amount of xp that user needs to earn from last level up to the next level up.
   * 
   * @returns {number} The amount of xp that user needs to earn from last level up to the next level up.
   */
  get dynamicNextLevelXp () {
    return xpFor(this.level + 1) - xpFor(this.level);
  }

  /**
   * Fetches the rank of this user.
   * 
   * @returns {Promise<number>} The rank of this user.
   */
  async fetchRank () {
    let members = await this.provider.getMembersFor(this.guildID);
    members = members.sort((a, b) => a.xp - b.xp);
    this.rank = (members.findIndex((user) => user.user_id === this.id)) + 1;
    return this.rank;
  }

  /**
   * Increases the user's xp by a certain amount.
   * 
   * @param {number} xp - The amount of xp to add to the user. 
   * @returns {Promise<object>} An object containing `oldLevel` and `newLevel` properties.
   */
  async appendXp (xp = 1) {
    const oldLevel = this.level;
    await this.provider.updateUser(this.id, this.guildID, this.xp + xp);
    await this.refetch();
    return { oldLevel, newLevel: this.level };
  }

  /**
   * Increases the user's xp by a certain amount.
   * 
   * @param {number} xp - The amount of xp to add to the user. 
   * @returns {Promise<object>} An object containing `oldLevel` and `newLevel` properties.
   */
  async appendLevel (xp = 1) {
    const oldXp = this.xp;
    await this.provider.updateUser(this.id, this.guildID, this.xp + xp);
    await this.refetch();
    return { oldXp, newXp: this.xp };
  }


  /**
   * Sets the user xp to a specified number.
   * 
   * @param {number} xp - The amount of xp to set. 
   * @returns {Promise<object>} An object containing `oldLevel` and `newLevel` properties.
   */
  async setXp (xp = 0) {
    const oldLevel = this.level;
    await this.provider.updateUser(this.id, this.guildID, xp);
    await this.refetch();
    return { oldLevel, newLevel: this.level };    
  }

  /**
   * Sets user's level to a specified number.
   * 
   * @param {number} level - The level to set the user. 
   * @returns {Promise<object>} An object containing `oldXp` and `newXp` properties.
   */
  async setLevel (level = 0) {
    const oldXp = this.xp;
    await this.provider.updateUser(this.id, this.guildID, xpFor(level));
    await this.refetch();
    return { oldXp, newXp: this.xp };    
  }

  /**
   * Refetches the properties of the user.
   * 
   * @returns {Promise<void>} It returns nothing.
   */
  async refetch () {
    const user = await this.provider.getUser(this.id, this.guildID);
    this.xp = user.xp;
    if (this.rank > -1) await this.fetchRank();
    return;
  }
}

module.exports = User;