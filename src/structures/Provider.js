/**
 * Represents a database provider which will extend this provider class.
 */
class Provider {
  /**
   * @param {string} name - The name of this provider. 
   * @param {object} options - An object of options.
   */
  constructor (name, options = {}) {
    /**
     * Represents the name of this provider.
     * 
     * @type {string}
     */
    this.name = name;

    /**
     * Represents the options of this provider.
     */
    this.options = options;
  }

  /**
   * The function that is called when a user is created.
   * 
   * @param {string} id - The id of the user that is being created.
   * @param {string} guild_id - The id of the guild of the user that is being created.
   * @param {number} xp - The amount of xp of the user that is being created.
   * 
   * @returns {boolean} - Whether this user has been created or not.
   */
  async createUser (id, guild_id, xp) { // eslint-disable-line no-unused-vars
    throw new Error("The provider must overwrite the `createUser` function.");
  }

  /**
   * The function that is called when a user is updated.
   * 
   * @param {string} id - The id of the user that is being updated.
   * @param {string} guild_id - The id of the guild of the user that is being updated.
   * @param {number} xp - The amount of xp of the user that is being updated.
   * 
   * @returns {boolean} - Whether this user has been updated or not.
   */
  async updateUser (id, guild_id, xp) { // eslint-disable-line no-unused-vars
    throw new Error("The provider must overwrite the `updateUser` function.");
  }

  /**
   * The function is called when a user is fetched from the database.
   * Returns an object: { user_id: String, guild_id: String, xp: Number, last_Updated: Number }
   * 
   * @param {string} id - The id of the user that is being updated.
   * @param {string} guild_id - The id of the guild of the user that is being updated.
   * 
   * @returns {object} - On object with properties `id`, `guild_id`, `xp`, `last_updated`.
   */
  async getUser (id, guild_id) { // eslint-disable-line no-unused-vars
    throw new Error("The provider must overwrite the `getUser` function.");
  }

  /**
   * The function is called when a users of a guild are fetched from the database.
   * Returns an array of objects: { user_id: String, guild_id: String, xp: Number, last_Updated: Number }
   * 
   * @param {string} guild_id - The id of the guild whose members are fetched.
   * 
   * @returns {object} - An array of objects with properties `id`, `guild_id`, `xp`, `last_updated`.
   */
  async getMembersFor (guild_id) { // eslint-disable-line no-unused-vars
    throw new Error("The provider must overwrite the `getMembersFor` function.");
  }

  /**
   * The function that is called after the provider's been initialized.
   */
  async init () {
    throw new Error("The provider must overwrite the `init` function and call it at the end of their constructor.");
  }

  /**
   * Tests if the value is of type.
   * 
   * @param {string} type - The type to test for.
   * @param {any} value - The value to test. 
   * @returns {boolean} Whether the value is of property.
   */
  _is (type, value) {
    return typeof value === type; 
  }
}

module.exports = Provider;