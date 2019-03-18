const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = '!';

const warn = require('./commands/warn.js');
const setgame = require('./commands/setgamesetstatus.js');
const ping = require('./commands/ping.js');
const apex = require('./commands/apex/index.js');
const level = require('./commands/level.js');
// const setguild = require ("./commands/guildevents.js");

const Enmap = require('enmap');
client.points = new Enmap({ name: 'points' });

client.on('ready', () => {
  console.log(
    `Bot has started, with ${client.users.size} users, in ${
      client.channels.size
    } channels of ${client.guilds.size} guilds.`
  );
});

client.on('message', message => {
  //let args = message.content.split(' ').slice(1);
  //var argresult = args.join(' ');

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  apex.apexResponse(message);
  ping.pingResponse(message);
  level.levelresponse(client, message);
  setgame.setgameresponse(client, message);

  // setguild.guildevents(client , message);
});
// client.on('guildMemberAdd', member => {
//   let guild = member.guild;
//   guild.defaultChannel.send('Velkommen ${member.user.username} Te servern');
// });

// Logge på / Starte opp boten
client.login(config.token);

// exports.client = client;
