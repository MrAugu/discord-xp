const { Provider } = require("../../index");
const { writeFile } = require("fs");
const { sep } = require("path");

/**
 * Represents the provider class for MongoDB.
 */
class JsonProvider extends Provider {
  constructor (...options) {
    super("json", ...options);

    /**
     * The url used to connect to the database.
     * 
     * @type {string}
     */
    this.fileName = this.options.fileName || "levels.json";
    if (!this.fileName || !this._is("string", this.fileName)) throw new Error("A the file name must be a string.");

    /**
     * The path of the directory where to store the file.
     * 
     * @type {string}
     */
    this.fileDir = this.options.path;
    if (!this.fileDir || !this._is("string", this.fileName)) throw new Error("A the file directory path name must be a string.");

    /**
     * The database object that gets automatically written to the database.
     */
    this.db = null;

    // Calling this, as specified in the provider spec.
    this.init();
  }

  /**
   * The function that is called when a user is created.
   * 
   * @param {string} id - The id of the user that is being created.
   * @param {string} guild_id - The id of the guild of the user that is being created.
   * @param {number} xp - The amount of xp of the user that is being created.
   * 
   * @returns {Promise<boolean>} - Whether this user has been created or not.
   */
  createUser (id, guild_id, xp) {
    return new Promise((resolve) => {
      this.db[`${guild_id}:${id}`] = {
        user_id: id,
        guild_id,
        xp,
        last_updated: Date.now()
      };
      resolve(true);
    });
  }


  /**
   * The function that is called when a user is updated.
   * 
   * @param {string} id - The id of the user that is being updated.
   * @param {string} guild_id - The id of the guild of the user that is being updated.
   * @param {number} xp - The amount of xp of the user that is being updated.
   * 
   * @returns {Promise<boolean>} - Whether this user has been updated or not.
   */
  updateUser (id, guild_id, xp) { // eslint-disable-line no-unused-vars
    return new Promise((resolve) => {
      if (this.db[`${guild_id}:${id}`]) {
        this.db[`${guild_id}:${id}`] = {
          xp,
          last_updated: Date.now()
        };
        resolve(true);
      } else {
        this.createUser(id, guild_id, xp).then(() => resolve(true)).catch(() => resolve(false));
      }
    });
  }

    
  /**
   * The function is called when a user is fetched from the database.
   * Returns an object: { user_id: String, guild_id: String, xp: Number, last_updated: Number }
   * 
   * @param {string} id - The id of the user that is being updated.
   * @param {string} guild_id - The id of the guild of the user that is being updated.
   * 
   * @returns {Promise<object|null>} - On object with properties `id`, `guild_id`, `xp`, `last_updated`.
   */
  getUser (id, guild_id) { // eslint-disable-line no-unused-vars
    return new Promise((resolve) => {
      if (!this.db[`${guild_id}:${id}`]) return resolve(null);
      else {
        const { user_id, guild_id, xp, last_updated } = this.db[`${guild_id}:${id}`];
        resolve({
          user_id,
          guild_id,
          xp,
          last_updated
        });
      }
    });
  }

  /**
   * The function is called when a users of a guild are fetched from the database.
   * Returns an array of objects: { user_id: String, guild_id: String, xp: Number, last_updated: Number }
   * 
   * @param {string} guild_id - The id of the guild whose members are fetched.
   * 
   * @returns {Promise<object>} - An array of objects with properties `id`, `guild_id`, `xp`, `last_updated`.
   */
  getMembersFor (guild_id) { // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
      try { 
        const dbArray = this._arraify(this.db);
        resolve(dbArray.filter(user => user.guild_id === guild_id));
      } catch (e) {
        reject(e);
      }
    });
  }

      
  /**
   * Attempts to set up the database object.
   * 
   * @returns {void}
   */
  async init () {
    this.db = this._setDb(`${this.fileDir}${sep}${this.fileName}`, console.warn);
  }

  /**
   * Sets up the JSON db object.
   * 
   * @param {string} path - The path to the file.
   * @param {Function} errCallback - The error callback.
   * @returns {Proxy} Returns an interface that saves data each mutation,
   */
  _setDb (path, errCallback) {
    const data = require(path);
    let queue = Promise.resolve();
  
    const write = () => {
      queue = queue.then(() => new Promise((resolve, reject) =>
        writeFile(path, JSON.stringify(data), (err) => {
          if (!err) return resolve();
          if (errCallback) return errCallback(err);
          reject(err);
        })
      ));
    };
  
    return new Proxy(data, {
      set: (obj, prop, value) => {
        obj[prop] = value;
        write();
      }
    });
  }

  /**
   * Produces an array of values from a given JSON object.
   * 
   * @param {object} object - The object which will be converted to an array.
   * @returns {any[]} The array.
   */
  _arraify (object) {
    const array = [];
    for (const item in object) array.push(object[item]);
    return array;
  }
}

module.exports = JsonProvider;