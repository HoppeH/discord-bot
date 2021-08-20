import * as Discord from 'discord.js';
require('dotenv').config()

import { config } from './config';
import { levelManagement, guildEvents } from './middleware';
import { messageHandler } from './messageHandler';


export class DiscordBot {

  private client;
  // private redisClient: RedisClient;
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

      // this.redisClient = redisDB.getRedisClient();
      guildEvents(this.client);
    });

    this.client.on('message', (message) => {

      if (!message.guild) return;

      // Logg all messages beeing sendt to the server
      levelManagement(this.client, message).catch((err) => console.log(err));

      // Split  prefix from the rest of the message
      const prefix: string = message.content.slice(0, 1)

      // Get all arguments
      const allArgs = message.content.substring(1).split(' ');

      // Setter alle argumenter
      const args = message.content.split(/\s+/g);
      const command = args.shift().slice(config.prefix.length).toLowerCase();

      if (prefix !== config.prefix) return;

      messageHandler(this.client, message, command, args);


    });

    // this.client.on('guildMemberAdd', (member) => {
    //   let guild = member.guild;
    //   guild.defaultChannel.send(`Velkommen ${member.user.username} Te servern`);
    // });

    // Logge på / Starte opp boten
    this.client.login(config.token);
  }



}
export const Client = new DiscordBot();
