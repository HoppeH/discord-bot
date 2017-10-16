const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = "!";


const warn = require ("./commands/warn.js");
const setgame = require ("./commands/setgamesetstatus.js");
const ping =  require ("./commands/ping.js");
const setlevel = require ("./commands/level.js");
//const setguild = require ("./commands/guildevents.js");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
//let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

// Sjekker innhold i points før det er endret
// console.log('Points start: ', points);

client.on("message", message => {
  //let args = message.content.split(' ').slice(1);
  //var argresult = args.join(' ');

	 if (!message.content.startsWith(config.prefix) || message.author.bot) return;

   ping.pingResponse(message);

   setgame.setgameresponse(client , message);

   let points = setlevel.setlevelresponse(client , message);

  // setguild.guildevents(client , message);

fs.writeFile("./points.json", JSON.stringify(points), (err) => {
  if (err) console.error(err)

});
});
//setguild.guildevents(client);
client.on('guildMemberAdd', member => {
  let guild = member.guild
  guild.defaultChannel.send('Velkommen ${member.user.username} Te servern');
});
// La til .catch for å fange evt feil
client.login(config.token);
    //.catch(err => console.log(err));

//GET https://pubgtracker.com/api/profile/pc/{pubg-nickname}
//GET https://pubgtracker.com/api/search?steamId={STEAM ID}
