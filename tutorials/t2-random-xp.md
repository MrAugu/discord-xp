
In the previous tutorial we had set up the `XpManager`, and now it's time to use it! We are going to do one of the most notorious things an xp bot does: giving users a random amount of xp on every message, so let's get started! Our file should look something around this lines:
```javascript
const Discord = new Discord.Client();
const client = new Discord.Client();
const DiscordXp = require("discord-xp");
client.xp = new DiscordXp.XpManager("mongodb", {
  "url": "mongodb://host:port/mydb"
}); // We have attached our xp manager to our discord client so we can access it from anywhere.

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("message", async (message) => {
  if (message.author.bot) return; // If the author is a bot, we do nothing.

  if (message.content === "!hello") {
    return message.reply("Hello darling!"); // If a human user sends !hello, we respond with 'Hello darling!'.
  }
});

client.login("MySuperSecretTokenIShallNeverReveal");
```

In order to earn xp, users have to send messges in a discord server, therefore we need to check for that before doing anything related to leveling.

```javascript
if (message.guild) {
  // Our code will go here.
}
```

In the `message` event we are going to search for the user or create it if its not in the database, using `XpManager#fetchOrCreate` function (see [XpManager#fetchOrCreate](/docs/XpManager.html#fetchOrCreate)).

```javascript
if (message.guild) {
  const user = await client.xp.fetchOrCreate(message.author.id, message.guild.id);
}
```

Now we have to get a random amount of xp, in this case I will go for a random amount of xp between 1 and 30.

```javascript 
if (message.guild) {
  const user = await client.xp.fetchOrCreate(message.author.id, message.guild.id);
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
}
```

And now we're going to add this xp to the user using the `User#appendXp` function (see [User#appendXp](/docs/User.html#appendXp)), which returns an object with the the following properties: `oldLevel` and `newLevel` - in order to see if the user has leveled up or not. We are going to store these values in the `xp` variable.

```javascript
if (message.guild) {
  const user = await client.xp.fetchOrCreate(message.author.id, message.guild.id);
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
  const xp = await user.appendXp(randomAmountOfXp); 
}
```

And now we check if the user has leveled up or not, we can use the `User#fetchRank` function to get the `User#rank` property that we can use.

```javascript
if (message.guild) {
  const user = await client.xp.fetchOrCreate(message.author.id, message.guild.id);
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
  const xp = await user.appendXp(randomAmountOfXp); // We add the xp.

  if (xp.oldLevel < xp.newLevel) { // Check if the new level is bigger than the older level which used had before adding the xp. 
    await user.fetchRank(); // We call this so we can use `User#rank`. 
    message.reply(`:tada: Well done, you've leveled up to **${xp.newLevel}**, you are now number **#${user.rank}** in the leaderboard!`);
  }
}
```

Now, our file should look something like this:
```javascript
const Discord = new Discord.Client();
const client = new Discord.Client();
const DiscordXp = require("discord-xp");
client.xp = new DiscordXp.XpManager("mongodb", {
  "url": "mongodb://host:port/mydb"
}); // We have attached our xp manager to our discord client so we can access it from anywhere.

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("message", async (message) => {
  if (message.author.bot) return; // If the author is a bot, we do nothing.

  if (message.guild) {
    const user = await client.xp.fetchOrCreate(message.author.id, message.guild.id);
    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
    const xp = await user.appendXp(randomAmountOfXp); // We add the xp.

    if (xp.oldLevel < xp.newLevel) { // Check if the new level is bigger than the older level which used had before adding the xp. 
      await user.fetchRank(); // We call this so we can use `User#rank`. 
      message.reply(`:tada: Well done, you've leveled up to **${xp.newLevel}**, you are now number **#${user.rank}** in the leaderboard!`);
    }
  }

  if (message.content === "!hello") {
    return message.reply("Hello darling!"); // If a human user sends !hello, we respond with 'Hello darling!'.
  }
});

client.login("MySuperSecretTokenIShallNeverReveal");
```
In the next tutorial we'll see how we can make a rank command!