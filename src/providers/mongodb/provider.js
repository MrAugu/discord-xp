const { Provider } = require("../../index");
const { createConnection } = require("mongoose");
const { UserSchema } = require("./models/users");

/**
 * Represents the provider class for MongoDB.
 */
class MongoProvider extends Provider {
  constructor (...options) {
    super("mongodb", ...options);

    /**
     * The url used to connect to the database.
     * 
     * @type {string}
     */
    this.url = this.options.url;
    if (!this.url || !this._is("string", this.url)) throw new Error("A string mongodb url must be specified.");

    /**
     * The model used to query the database.
     *
     * @type {object|null}
     */
    this.model = null;

    /**
     * Whether or not there is a db connection ongoing.
     * 
     * @type {boolean}
     */
    this.connected = false;

    /**
     * The connection used to query the database.
     * 
     * @type {object|null} 
     */
    this.db = null;

    /**
     * Remaining attempts to connect to the database.
     * 
     * @type {number}
     */
    this.remainingAttempts = 10;

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
    return new Promise((resolve, reject) => {
      const newUser = new this.model({
        user_id: id,
        guild_id,
        xp,
        last_updated: Date.now()
      });
      newUser.save()
        .then(() => resolve(true))
        .catch(() => reject(false));
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
    return new Promise((resolve, reject) => {
      this.model.findOne({ user_id: id, guild_id }).then((user) => {
        if (!user) {
          this.createUser(id, guild_id, xp).then(() => resolve(true)).catch(() => reject(false));
        } else {
          user.xp = xp;
          user.last_updated = Date.now();
          user.save().then(() => resolve(true)).catch(() => reject(false));
        }
      }).catch(() => reject(false));
    });
  }

  /**
   * The function is called when a user is fetched from the database.
   * Returns an object: { user_id: String, guild_id: String, xp: Number, last_updated: Number }
   * 
   * @param {string} id - The id of the user that is being updated.
   * @param {string} guild_id - The id of the guild of the user that is being updated.
   * 
   * @returns {object} - On object with properties `id`, `guild_id`, `xp`, `last_updated`.
   */
  getUser (id, guild_id) { // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
      this.model.findOne({ user_id: id, guild_id }).then((user) => {
        if (!user) resolve(null);
        const { user_id, guild_id, xp, last_updated } = user;
        resolve({
          user_id,
          guild_id,
          xp,
          last_updated
        });
      }).catch(() => reject(null));
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
      this.model.find({ guild_id }).then((users) => {
        resolve(users.map((user) => ({
          user_id: user.id,
          guild_id: user.guild_id,
          xp: user.xp,
          last_updated: user.last_updated
        })));
      }).catch((err) => reject(err));
    });
  }

  /**
   * Attempts to establish an ongoing connection with the database.
   * 
   * @returns {void}
   */
  async init () {
    while (this.remainingAttempts > 0 && !this.connected) {
      if (this.remainingAttempts !== 10) console.warn(`Connection to the database failed, attempting to connect. (${this.remainingAttempts} remaining attempts)`);
      const hasConnected = await this._createConnection();
      if (hasConnected) break;
    }
    if (!this.connected) {
      console.error("Fatal Error: Connection to the database has failed after 10 attempts, exiting the process.");
      process.exit(1);
    }
  }

  /**
   * Attempts to create a connection and set up the specific instance values.
   * 
   * @returns {Promise<object>} Returns an object with the boolean `connected`, if false it will also return a `reason`.
   */
  _createConnection () {
    return new Promise((resolve, reject) => {
      createConnection(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }).then((connection) => {
        this.db = connection;
        this.connected = true;
        this.model = this.db.model("levels", UserSchema);
        resolve({
          connected: true
        });
      }).catch((reason) => {
        reject({
          connected: false,
          reason
        });
      });
    });
  }
}

module.exports = MongoProvider;