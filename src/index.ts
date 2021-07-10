const Discord = require('discord.js');
const fs = require('fs');

import { redisDB } from './service';

const client = new Discord.Client();
import { config } from './config';
const prefix = '!';
let redisClient;
import { warn, setgameresponse, pingResponse, apexResponse, levelresponse } from './commands';
import { levelManagement } from './middleware/levels';
// const setguild = require ("./commands/guildevents.js");

// const Enmap = require('enmap');
// client.points = new Enmap({ name: 'points' });

client.on('ready', () => {
  console.log(
    // `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
    `Bot has started ==>>`
  );
  redisClient = redisDB.getRedisClient();

  // console.log(client.users);
});

client.on('message', (message) => {
  // console.log(message.member.user.id);
  // let args = message.content.split(' ').slice(1);
  // const argresult = args.join(' ');


  levelManagement(client, message).catch((err) => console.log(err));

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  let args = message.content.split(' ');

  switch (args[0]) {
    case '!ping': {
      pingResponse(message);
      break;
    }

    case '!apex': {
      apexResponse(message);
      break;
    }

    case '!points': {
      levelresponse(client, message);
      break;
    }

    case '!setstatus':
    case '!setgame': {
      setgameresponse(client, message);
      break;
    }

    default: {
      message.channel.send(`Ikke gyldig kommando: ${args[0]}`);
      break;
    }
  }

  // setguild.guildevents(client , message);
});
client.on('guildMemberAdd', (member) => {
  let guild = member.guild;
  guild.defaultChannel.send(`Velkommen ${member.user.username} Te servern`);
});

// Logge på / Starte opp boten
client.login(config.token);

// exports.client = client;
