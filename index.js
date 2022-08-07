<<<<<<< Updated upstream
const mongoose = require("mongoose");
const levels = require("./models/levels.js");
var mongoUrl;
=======
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const levels = require('./models/levels.js');
const rewards = require('./models/rewards.js');
let mongoUrl;

// Checking if the person has NodeJS v16 or higher
if(process.version.slice(1, 3) - 0 < 16) {
	throw new Error(
		`NodeJS Version 16 or newer is required, but you are using ${process.version}. See https://nodejs.org to update.`,
	);
}
>>>>>>> Stashed changes

class DiscordXp {

	/**
  * @param {string} [dbUrl] - A valid mongo database URI.
  */

	static async setURL(dbUrl) {
		if (!dbUrl) throw new TypeError('A database url was not provided.');
		mongoUrl = dbUrl;
		return mongoose.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
	}

	/**
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [level] - level.
  *@param {string} [roleId] - Role reward id.
  */

	static async addRoleReward(guildId, level, roleId) {
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (!level) throw new TypeError('A level was not provided.');
		if (!roleId) throw new TypeError('A role id was not provided.');

		const guildEntry = await rewards.findOne({ guildID: guildId });
		const isReward = await rewards.findOne({
			guildID: guildId,
			rewards: {
				$elemMatch: {
					level: level,
				},
			},
		});
		// guild entry does not exist
		if(!guildEntry) {
			const newReward = new rewards({
				guildID: guildId,
				rewards: { level: level, roleId: roleId },
			});

			await newReward.save().catch(e => console.log(`Failed to create role reward: ${e}`));

			return newReward;
		}
		// guildEntry exists but level reward also
		if (guildEntry && isReward) return false;
		if(guildEntry && !isReward) {
			guildEntry.rewards.push({ level: level, roleId: roleId });
			await guildEntry.save().catch(e => console.log(`Failed to create role reward: ${e}`));
			return guildEntry;
		}
	}

	/**
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [level] - level.
  *@param {string} [roleId] - Role reward id.
  */

	static async deleteRoleReward(guildId, level) {
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (!level) throw new TypeError('A level was not provided.');

		const isReward = await rewards.findOne({
			guildID: guildId,
			rewards: {
				$elemMatch: {
					level: level,
				},
			},
		});
		if (!isReward) return false;

		const filteredRewardEntries = isReward.rewards.filter(item => item.level !== level);

		isReward.rewards = filteredRewardEntries;
		isReward.lastUpdated = new Date();

		await isReward.save().catch(e => console.log(`Failed to delete role reward: ${e}`));

		return isReward;
	}

	/**
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [level] - level.
  *@param {string} [roleId] - Role reward id.
  */

	static async fetchRoleReward(guildId, level) {
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (!level) throw new TypeError('A level was not provided.');

		const isReward = await rewards.findOne({
			guildID: guildId,
			rewards: {
				$elemMatch: {
					level: level,
				},
			},
		});
		if (!isReward) return false;

		const filteredRewardEntries = isReward.rewards.filter(item => item.level === level);

		return filteredRewardEntries[0];
	}

	/**
  * @param {string} [client] - Your Discord.CLient.
  * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
  */

	static async cleanDatabase(client, guildId) {
		if (!client) throw new TypeError('A client was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');

		const users = await levels.find({ guildID: guildId });

		// return users.slice(0, limit);

		const computedArray = [];


		for (const user of users) {

			try {
				const isUser = await client.users.fetch(user.userID);

			}
			catch (error) {
				console.error(error);
				console.log(user);
				computedArray.push(user.userID);
				return await levels.findOneAndDelete({ userID: user.userID, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`));
			}
		}


		return computedArray;
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

	static async createUser(userId, guildId) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');

		const isUser = await levels.findOne({ userID: userId, guildID: guildId });
		if (isUser) return false;

		const newUser = new levels({
			userID: userId,
			guildID: guildId,
		});

		await newUser.save().catch(e => console.log(`Failed to create user: ${e}`));

		return newUser;
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

	static async deleteUser(userId, guildId) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');

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

	static async appendXp(userId, guildId, xp) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError('An amount of xp was not provided/was invalid.');

		const user = await levels.findOne({ userID: userId, guildID: guildId });

		if (!user) {
			const newUser = new levels({
				userID: userId,
				guildID: guildId,
				xp: xp,
				level: Math.floor(0.1 * Math.sqrt(xp)),
			});

			await newUser.save().catch(e => console.log('Failed to save new user.'));

			return (Math.floor(0.1 * Math.sqrt(xp)) > 0);
		}

		user.xp += parseInt(xp, 10);
		user.level = Math.floor(0.1 * Math.sqrt(user.xp));
		user.lastUpdated = new Date();

		await user.save().catch(e => console.log(`Failed to append xp: ${e}`));
		/*
    const isReward = await rewards.findOne({ guildID: guildId, rewards: level });
    if(Math.floor(0.1 * Math.sqrt(user.xp -= xp)) < user.level && isReward) return isReward;
 */
		return (Math.floor(0.1 * Math.sqrt(user.xp -= xp)) < user.level);
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [levels] - Amount of levels to append.
  */

	static async appendLevel(userId, guildId, levelss) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (!levelss) throw new TypeError('An amount of levels was not provided.');

		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.level += parseInt(levelss, 10);
		user.xp = user.level * user.level * 100;
		user.lastUpdated = new Date();

		user.save().catch(e => console.log(`Failed to append level: ${e}`));

		return user;
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [xp] - Amount of xp to set.
  */

	static async setXp(userId, guildId, xp) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError('An amount of xp was not provided/was invalid.');

		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.xp = xp;
		user.level = Math.floor(0.1 * Math.sqrt(user.xp));
		user.lastUpdated = new Date();

		user.save().catch(e => console.log(`Failed to set xp: ${e}`));

		return user;
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [level] - A level to set.
  */

	static async setLevel(userId, guildId, level) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (!level) throw new TypeError('A level was not provided.');

		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.level = level;
		user.xp = level * level * 100;
		user.lastUpdated = new Date();

		user.save().catch(e => console.log(`Failed to set level: ${e}`));

		return user;
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  */

	static async fetch(userId, guildId, fetchPosition = false) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');

		const user = await levels.findOne({
			userID: userId,
			guildID: guildId,
		});
		if (!user) return false;

		if (fetchPosition === true) {
			const leaderboard = await levels.find({
				guildID: guildId,
			}).sort([['xp', 'descending']]).exec();

			user.position = leaderboard.findIndex(i => i.userID === userId) + 1;
		}


		/* To be used with canvacord or displaying xp in a pretier fashion, with each level the cleanXp stats from 0 and goes until cleanNextLevelXp when user levels up and gets back to 0 then the cleanNextLevelXp is re-calculated */
		user.cleanXp = user.xp - this.xpFor(user.level);
		user.cleanNextLevelXp = this.xpFor(user.level + 1) - this.xpFor(user.level);

		return user;
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [xp] - Amount of xp to subtract.
  */

	static async subtractXp(userId, guildId, xp) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError('An amount of xp was not provided/was invalid.');

		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.xp -= xp;
		user.level = Math.floor(0.1 * Math.sqrt(user.xp));
		user.lastUpdated = new Date();

		user.save().catch(e => console.log(`Failed to subtract xp: ${e}`));

		return user;
	}

	/**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [levels] - Amount of levels to subtract.
  */

	static async subtractLevel(userId, guildId, levelss) {
		if (!userId) throw new TypeError('An user id was not provided.');
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (!levelss) throw new TypeError('An amount of levels was not provided.');

		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.level -= levelss;
		user.xp = user.level * user.level * 100;
		user.lastUpdated = new Date();

		user.save().catch(e => console.log(`Failed to subtract levels: ${e}`));

		return user;
	}

	/**
  * @param {string} [guildId] - Discord guild id.
  * @param {number} [limit] - Amount of maximum enteries to return.
  */


	static async fetchLeaderboard(guildId, limit) {
		if (!guildId) throw new TypeError('A guild id was not provided.');
		if (!limit) throw new TypeError('A limit was not provided.');

<<<<<<< Updated upstream
    const users = await levels.find({ guildID: guildId }).sort([['xp', 'descending']]).limit(limit).exec();

    return users;
  }
=======
		const users = await levels.find({ guildID: guildId }).sort([['xp', 'descending']]).exec();

		return users.slice(0, limit);
	}
>>>>>>> Stashed changes

	/**
  * @param {string} [client] - Your Discord.CLient.
  * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
  */

	static async computeLeaderboard(client, leaderboard, fetchUsers = false) {
		if (!client) throw new TypeError('A client was not provided.');
		if (!leaderboard) throw new TypeError('A leaderboard id was not provided.');

		if (leaderboard.length < 1) return [];

		const computedArray = [];

		if (fetchUsers) {
			for (const key of leaderboard) {
				const user = await client.users.fetch(key.userID) || { username: 'Unknown', discriminator: '0000' };
				computedArray.push({
					guildID: key.guildID,
					userID: key.userID,
					xp: key.xp,
					level: key.level,
					position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
					username: user.username,
					discriminator: user.discriminator,
				});
			}
		}
		else {
			leaderboard.map(key => computedArray.push({
				guildID: key.guildID,
				userID: key.userID,
				xp: key.xp,
				level: key.level,
				position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
				username: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : 'Unknown',
				discriminator: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : '0000',
			}));
		}

		return computedArray;
	}

	/*
  * @param {number} [targetLevel] - Xp required to reach that level.
  */
	static xpFor(targetLevel) {
		if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10))) throw new TypeError('Target level should be a valid number.');
		if (isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10);
		if (targetLevel < 0) throw new RangeError('Target level should be a positive number.');
		return targetLevel * targetLevel * 100;
	}

	/**
  * @param {string} [guildId] - Discord guild id.
  */

	static async deleteGuild(guildId) {
		if (!guildId) throw new TypeError('A guild id was not provided.');

		const guild = await levels.findOne({ guildID: guildId });
		if (!guild) return false;

		await levels.deleteMany({ guildID: guildId }).catch(e => console.log(`Failed to delete guild: ${e}`));

		return guild;
	}
}

module.exports = DiscordXp;
