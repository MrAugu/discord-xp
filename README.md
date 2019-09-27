<p align="center"><a href="https://nodei.co/npm/discord-xp/"><img src="https://nodei.co/npm/discord-xp.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord-xp"> <img src="https://img.shields.io/github/repo-size/MrAugu/discord-xp"> <img src="https://img.shields.io/npm/l/discord-xp"> <img src="https://img.shields.io/github/contributors/MrAugu/discord-xp"> <img src="https://img.shields.io/github/package-json/dependency-version/MrAugu/discord-xp/mongoose"></p>

## Discord-XP
A lightweight and easy to use framework for discord bots, uses MongoDB.

## Download
You can download it from npm:
```cli
npm i discord-xp
```

## Setting Up
First things first, we include the module into the project.
```js
const Levels = require("discord-xp");
```
After that, you need to provide a valid mongo database url, and set it. You can do so by:
```js
Levels.setURL("mongodb://..."); // You only need to do this ONCE per process.
```

## Methods
**createUser**

Creates an entry in database for that user if it doesnt exist.
```js
Levels.createUser(<UserID>, <GuildID>);
```
- Output:
```
Promise<Object>
```
**deleteUser**

If the entry exists, it deletes it from database.
```js
Levels.deleteUser(<UserID>, <GuildID>);
```
- Output:
```
Promise<Object>
```
**appendXp**

It adds a specified amount of xp to the current amount of xp for that user, in that guild. It re-calculates the level. It creates a new user with that amount of xp, if there is no entry for that user. 
```js
Levels.appendXp(<UserID>, <GuildID>, <Amount>);
```
- Output:
```
Promise<Boolean>
```
**appendLevel**

It adds a specified amount of levels to current amount, re-calculates and sets the xp reqired to reach the new amount of levels. 
```js
Levels.appendLevel(<UserID>, <GuildID>, <Amount>);
```
- Output:
```
Promise<Boolean/Object>
```
**setXp**

It sets the xp to a specified amount and re-calculates the level.
```js
Levels.setXp(<UserID>, <GuildID>, <Amount>);
```
- Output:
```
Promise<Boolean/Object>
```
**setLevel**

Calculates the xp required to reach a specified level and updates it.
```js
Levels.setLevel(<UserID>, <GuildID>, <Amount>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetch**

Retrives selected entry from the database, if it exists.
```js
Levels.fetch(<UserID>, <GuildID>);
```
- Output:
```
Promise<Object>
```
**subtractXp**

It removes a specified amount of xp to the current amount of xp for that user, in that guild. It re-calculates the level.
```js
Levels.appendXp(<UserID>, <GuildID>, <Amount>);
```
- Output:
```
Promise<Boolean/Object>
```
**subtractLevel**

It removes a specified amount of levels to current amount, re-calculates and sets the xp reqired to reach the new amount of levels. 
```js
Levels.appendLevel(<UserID>, <GuildID>, <Amount>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetchLeaderboard**

It gets a specified amount of entries from the database, ordered from higgest to lowest within the specified limit of entries.
```js
Levels.fetchLeaderboard(<GuildID>, <Limit>);
```
- Output:
```
Promise<Array [Objects]>
```
**computeLeaderboard**

It returns a new array of object that include level, xp, guild id, user id, leaderboard position, username and discriminator.
```js
Levels.fetch(<Discord Client>, <Levels.fetchLeaderboard output>);
```
- Output:
```
Array [Objects]
```
