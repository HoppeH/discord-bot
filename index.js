const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = "!";
const warn = require("./commands/warn.js");
const setgame = require("./commands/setgamesetstatus.js");
const ping =  require ("./commands/ping.js");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

// Sjekker innhold i points før det er endret
// console.log('Points start: ', points);

client.on("message", message => {
  //let args = message.content.split(' ').slice(1);
  //var argresult = args.join(' ');

	 if (!message.content.startsWith(config.prefix) || message.author.bot) return;

   ping.pingResponse(message);

   setgame.setgameresponse(client , message);

  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };


  let userData = points[message.author.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));

  // console.log('Points of user: ', curLevel);

  // La til .catch for å fange evt feil
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`Du e level **${curLevel}**!`)
    //.catch(err => console.log(err));
  }
// La til .catch for å fange evt feil
  if (message.content.startsWith(prefix + "level")) {
    message.reply(`Du e level ${userData.level}, med ${userData.points} poeng.`)
    //.catch(err => console.log(err));
  }

  // La til .catch for å fange evt feil
 if (message.content.startsWith(prefix + "points")) {
	 message.reply(`Du har ${userData.points} poeng.`)
  // .catch(err => console.log(err));
 }

// sjekke innhold i points etter det er endret
// console.log('Points end: ', points);

fs.writeFile("./points.json", JSON.stringify(points), (err) => {
  if (err) console.error(err)
  });
});
//guild
client.on('guildMemberAdd', member => {
let guild = member.guild
guild.defaultChannel.sendMessage('Velkommen ${member.user.username} Te servern')
});

client.on('guildMemberRemove', member => {
let guild = member.guild
guild.defaultChannel.sendMessage('hadebra ${member.user.username} Vi snakkes')
//client





});
// La til .catch for å fange evt feil
client.login(config.token);
    //.catch(err => console.log(err));

//GET https://pubgtracker.com/api/profile/pc/{pubg-nickname}
//GET https://pubgtracker.com/api/search?steamId={STEAM ID}
