In this tutorial we'll be learning to set up `discord-xp` to work with discord.js.
First, let's kick things off by creating a bot file.

```javascript
const Discord = new Discord.Client();
const client = new Discord.Client();

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

Now, we have to import our library below.
```javascript
const DiscordXp = require("discord-xp");
```

Now, we need to instantiate the `XpManager`, we currently support 2 types of providers: `json` and `mongodb`.

- (1) Instantiating the `XpManager` with the `mongodb` provider (our recomended storage provider):
```javascript
client.xp = new DiscordXp.XpManager("mongodb", {
  "url": "mongodb://host:port/mydb"
});
```
- (2) Instantiating the `XpManager` with the `json` provider (not so recomended - it's prone to corruption though we crafted a module on top of the file-system to minimize this risk):
```javascript
client.xp = new DiscordXp.XpManager("json", {
  "fileName": "levels.json",
  "path": __dirname
});
```

# TypeScript Warning
  If you are a typescript user, you need to declare a new XpManager for every file where you have xp related code, and because of that, we do not recomend under any way shape or form using a local storage provider such as JSON due to its increased risk of corruption due to constant writes at shorter intervals.

If you are a typescript user, feel free to check the [TypeScript Tutorial here](/docs/t5-typescript.md) - coming soon!

## Back to our code

Now our file should look something like this:
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

In the next tutorial we'll set up granting users random xp every message.