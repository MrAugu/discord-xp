<p align="center"><a href="https://nodei.co/npm/discord-xp/"><img src="https://nodei.co/npm/discord-xp.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord-xp"> <img src="https://img.shields.io/github/repo-size/MrAugu/discord-xp"> <img src="https://img.shields.io/npm/l/discord-xp"> <img src="https://img.shields.io/github/contributors/MrAugu/discord-xp"> <img src="https://img.shields.io/github/package-json/dependency-version/MrAugu/discord-xp/mongoose"> <a href="https://discord.gg/rk7cVyk"><img src="https://discordapp.com/api/guilds/630058179547627592/widget.png" alt="Discord server"/></a></p>

# Discord-Xp
- A lightweight and easy to use xp framework for discord bots, uses MongoDB.
- If you need help feel free to join our <a href="https://discord.gg/rk7cVyk">discord server</a> to talk and help you with your code.
- If you encounter any of those fell free to open an issue in our <a href="https://github.com/MrAugu/discord-xp/issues">github repository</a>.

# Download & Update
You can download it from npm:
```cli
npm i discord-xp
```
You can update to a newer version to receive updates using npm.
```cli
npm update discord-xp
```

# Changelog
- **25 February 2021** (v1.1.8) - Preventing further deprection warnings to be displayed, if you encounter any of these deprecation issues, update the module.

- **22 November 2020** (v1.1.7) `WARNING: This semi-major version contains breaking changes in the way leaderboard computing function works.`
1. Added an optional `fetchPosition` argument to the `Levels.fetch` which will add the leaderboard rank as the `position` property. Caution: Will be slower on larger servers.
2. `Levels.computeLeaderboard` is now asynchronous and can take in a third parameter called `fetchUsers` which will fetch all users on the leaderboard. This parameter **does not** require additional Gateway Intents. Caution: Will be substantially slower if you do not have `Guild_Members` intent and catch some users beforehand. 

- **16 July 2020** - Added `xpFor` method to calculate xp required for a specific level.
```js
/* xpFor Example */
const Levels = require("discord-xp");
// Returns the xp required to reach level 30.
var xpRequired = Levels.xpFor(30);

console.log(xpRequired); // Output: 90000
```

# Setting Up
First things first, we include the module into the project.
```js
const Levels = require("discord-xp");
```
After that, you need to provide a valid mongo database url, and set it. You can do so by:
```js
Levels.setURL("mongodb://..."); // You only need to do this ONCE per process.
```

# Examples
*Examples assume that you have setted up the module as presented in 'Setting Up' section.*
*Following examples assume that your `Discord.Cient` is called `client`.*

*Following examples assume that your `client.on("message", message` is called `message`.*

*Following example contains isolated code which you need to integrate in your own command handler.*

*Following example assumes that you are able to write asynchronous code (use `await`).*

- **Allocating Random XP For Each Message Sent**

```js
client.on("message", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guild.id);
    message.channel.send(`${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`);
  }
});
```
- **Rank Command**

```js
const target = message.mentions.users.first() || message.author; // Grab the target.

const user = await Levels.fetch(target.id, message.guild.id); // Selects the target from the database.

if (!user) return message.channel.send("Seems like this user has not earned any xp so far."); // If there isnt such user in the database, we send a message in general.

message.channel.send(`> **${target.tag}** is currently level ${user.level}.`); // We show the level.
```

- **Leaderboard Command**

```js
const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.

if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.

const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
```

*Is time for you to get creative..*

# Methods
**createUser**

Creates an entry in database for that user if it doesnt exist.
```js
Levels.createUser(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Object>
```
**deleteUser**

If the entry exists, it deletes it from database.
```js
Levels.deleteUser(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Object>
```
**appendXp**

It adds a specified amount of xp to the current amount of xp for that user, in that guild. It re-calculates the level. It creates a new user with that amount of xp, if there is no entry for that user. 
```js
Levels.appendXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean>
```
**appendLevel**

It adds a specified amount of levels to current amount, re-calculates and sets the xp reqired to reach the new amount of levels. 
```js
Levels.appendLevel(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**setXp**

It sets the xp to a specified amount and re-calculates the level.
```js
Levels.setXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**setLevel**

Calculates the xp required to reach a specified level and updates it.
```js
Levels.setLevel(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetch** (**Updated recently!**)

Retrives selected entry from the database, if it exists.
```js
Levels.fetch(<UserID - String>, <GuildID - String>, <FetchPosition - Boolean>);
```
- Output:
```
Promise<Object>
```
**subtractXp**

It removes a specified amount of xp to the current amount of xp for that user, in that guild. It re-calculates the level.
```js
Levels.appendXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**subtractLevel**

It removes a specified amount of levels to current amount, re-calculates and sets the xp reqired to reach the new amount of levels. 
```js
Levels.appendLevel(<UserID - String>, <GuildID - String>, <Amount - Number>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetchLeaderboard**

It gets a specified amount of entries from the database, ordered from higgest to lowest within the specified limit of entries.
```js
Levels.fetchLeaderboard(<GuildID - String>, <Limit - Integer>);
```
- Output:
```
Promise<Array [Objects]>
```
**computeLeaderboard** (**Updated recently!**)

It returns a new array of object that include level, xp, guild id, user id, leaderboard position, username and discriminator.
```js
Levels.fetch(<Client - Discord.js Client>, <Leaderboard - fetchLeaderboard output>);
```
- Output:
```
Promise<Array [Objects]>
```
**xpFor**

It returns a number that indicates amount of xp required to reach a level based on the input.
```js
Levels.xpFor(<TargetLevel - Integer>);
```
- Output:
```
Integer
```
