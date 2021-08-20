import * as Discord from 'discord.js';


require('dotenv').config()
// const fs = require('fs');

import { redisDB } from './service';
import { config } from './config';

import { warn, setgameresponse, pingResponse, apexResponse, userHandler } from './commands';
import { levelManagement } from './middleware/levels';



export class DiscordBot {

  private client;
  private redisClient;
  constructor() {

    this.client = new Discord.Client();
    this.init();
  }

  init() {
    this.client.on('ready', () => {
      console.log(
        // `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
        `Bot has started ==>>`
      );

      this.redisClient = redisDB.getRedisClient();

      // console.log(client.users);
    });

    this.client.on('message', (message) => {
      // console.log(message.author.bot)
      // if () return;
      levelManagement(this.client, message).catch((err) => console.log(err));


      // console.log(message.member.user.id);
      const prefix: string = message.content.slice(0, 1)


      const allArgs = message.content.substring(1).split(' ');

      // Setter kommand
      // const command = allArgs[0]


      // Setter alle argumenter
      // const args = allArgs.slice(1);

      const args = message.content.split(/\s+/g);
      const command = args.shift().slice(config.prefix.length).toLowerCase();



      if (prefix !== config.prefix) return;

      switch (command) {
        case 'ping': {
          console.log('ping case')
          pingResponse(message, command);
          break;
        }

        case 'apex': {
          apexResponse(message);
          break;
        }

        case 'cleanup':
        case 'give':
        case 'leaderboard':
        case 'multi':
        case 'points': {
          userHandler(this.client, message, command, args);
          break;
        }

        case 'setstatus':
        case 'setgame': {
          setgameresponse(this.client, message, command, args);
          break;
        }

        default: {
          message.channel.send(`Ikke gyldig kommando: ${args[0]}`);
          break;
        }
      }

      // setguild.guildevents(client , message);
    });

    this.client.on('guildMemberAdd', (member) => {
      let guild = member.guild;
      guild.defaultChannel.send(`Velkommen ${member.user.username} Te servern`);
    });

    // Logge på / Starte opp boten
    this.client.login(config.token);
  }
  // exports.client = client;
}
export const Client = new DiscordBot();
