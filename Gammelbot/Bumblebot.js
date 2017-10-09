const Discord = require("discord.js");
const newUsers = new Discord.Collection();
const client = new Discord.Client();
const config = require("./config.json");
const { PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH } = require('pubg-api-redis');

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
    // Exit and stop if the prefix is not there or if user is a bot
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    if (message.content.startsWith(config.prefix + "funk")) {
        message.channel.send("funke!");
    } else
        if (message.content.startsWith(config.prefix + "yey")) {
            message.channel.send("MHM!");
        } else
            if (message.content.startsWith(config.prefix + "ping")) {
                message.channel.send("pong!");
            }
});
    client.on("guildMemberAdd", (member) => {
        const guild = member.guild;
        if (!newUsers[guild.id]) newUsers[guild.id] = new Discord.Collection();
        newUsers[guild.id].set(member.id, member.user);

        if (newUsers[guild.id].size > 10) {
            const userlist = newUsers[guild.id].map(u => u.toString()).join(" ");
            guild.channels.get(guild.id).send("Welcome our new users!\n" + userlist);
            newUsers[guild.id].clear();
        }
    });

    client.on("guildMemberRemove", (member) => {
        const guild = member.guild;
        if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
    });

    client.login(config.token);
if (message.content.startsWith(config.prefix + "stats")) {
    message.channel.send(get "https://pubgtracker.com/api/profile/pc/{pubg-nickname}")
}
    "rankData": {
        "wins": 518,
            "rating": 263,
                "kills": 59,
                "winPoints": 518
                "region": "eu"
                "match": "solo"
                "playerName":
                "killDeathRatio"