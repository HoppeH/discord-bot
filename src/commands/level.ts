import { config } from '../config'
import { redisDB } from '../service';
// const config = require('./../config.json');
const fs = require('fs');
const prefix = '!';
const Discord = require('discord.js');
// const client = require('../index.js');
// const levelsDb = require('./levelsDb');

const axios = require('axios');

const apiUrl = 'http://home.hoppeh.no:3333';

export const levelresponse = async function (client, message) {

  if (!message.guild) return;

  // As usual, we stop processing if the message does not start with our prefix.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Also we use the config prefix to get our arguments and command:
  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(config.prefix.length).toLowerCase();

  // Let's build some useful ones for our points system.
  const key = `${message.guild.id}-${message.author.id}`;
  if (command === 'points') {


    let { ...userData2 } = await redisDB.hgetall(key)


    return message.channel.send(
      `Du har ${userData2.points} poeng, å e level ${userData2.level}!`
    );
  }

  if (command === 'leaderboard') {

    const top10 = await redisDB.zrevrange([`leaderboard-${message.guild.id}`, "0", "9"])

    let embedCosmos = new Discord.MessageEmbed()
      .setTitle('Leaderboard')
      // .setAuthor('HoppeH')
      .setDescription('Top 10 users!')
      .setColor(0x00ae86)
      .addField('test', 'test');

    for (let userId of top10) {
      const userData = await redisDB.hgetall(`${message.guild.id}-${userId}`)
      // message.channel.send(`Rank: ${index + 1} - ${data.userName} Level: ${data.level} Points: ${data.points}`)
      console.log(userData);
      embedCosmos.addField(
        `#1 - ${userData.userName}`,
        `Level: ${userData.level} - Points: ${userData.points}`
      );

    }

    console.log(embedCosmos);


    return message.channel.send(embedCosmos);




    // console.log(top10);
    // // Get a filtered list (for this guild only), and convert to an array while we're at it.
    // const filtered = client.points
    //   .array()
    //   .filter((p) => p.guild === message.guild.id);

    // // Sort it to get the top results... well... at the top. Y'know.
    // const sorted = filtered.sort((a, b) => b.points - a.points);

    // // Slice it, dice it, get the top 10 of it!
    // const top10 = sorted.splice(0, 10);

    // Now shake it and show it! (as a nice embed, too!)
    // const embed = new Discord.RichEmbed()
    //   .setTitle('Leaderboard')
    //   .setAuthor(client.user.username, client.user.avatarURL)
    //   .setDescription('Top 10 brukera!')
    //   .setColor(0x00ae86);
    // for (const data of top10) {
    //   embed.addField(
    //     client.users.get(data.user).tag,
    //     `${ data.points } points(level ${ data.level })`
    //   );
    // }

    // axios
    //   .post(apiUrl + '/leaderboard', {
    //     userId: message.author.id,
    //     guildId: message.guild.id,
    //     username: message.author.username,
    //   })
    //   .then((res) => {
    //     console.log(`Response from leaderboard`);

    // let embedCosmos = new Discord.MessageEmbed()
    //   .setTitle('Leaderboard')
    //   .setAuthor('HoppeH')
    //   .setDescription('Top 10 brukera!')
    //   .setColor(0x00ae86);

    // for (let item of top10) {
    //   // console.log(item.$1);
    //   embedCosmos.addField(
    //     item,
    //     `${ item } points)`
    //     // `${ item.$1.points } points(level ${ item.$1.level })`
    //   );
    // }
    // console.log(embedCosmos);
    // return message.channel.send({ embedCosmos });
    //   })
    //   .catch((err) => console.log(`Err from leaderboard`, err));

    // Now shake it and show it! (as a nice embed, too!)

    // console.log(embed);

    // message.channel.send({ embedCosmos });



  }


  // console.log(message.guild.ownerID);
  if (command === 'give') {
    // Limited to guild owner - adjust to your own preference!
    if (message.author.id !== message.guild.ownerID)
      return message.reply('Du e ikje sjæf,du kan ikje gjøre sånn!');

    const user = message.mentions.users.first() || client.users.get(args[0]);
    if (!user)
      return message.reply('Æ må vette kem æ ska gje poeng (Klient ID takk)!');

    const pointsToAdd = parseInt(args[1], 10);
    if (!pointsToAdd)
      return message.reply('Du sa ikje kor mange poeng æ sku gje...');

    const key = `${message.guild.id} -${user.id} `;

    // Ensure there is a points entry for this user.
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1,
      lastSeen: new Date(),
    });

    // Add the points to the enmap for this user.
    client.points.math(key, '+', pointsToAdd, 'points');

    message.channel.send(
      `${user.tag} har fått ${pointsToAdd} poeng å har nu ${client.points.get(
        key,
        'points'
      )
      } points.`
    );
  }

  if (command === 'cleanup') {
    // Let's clean up the database of all "old" users, and those who haven't been around for... say a month.

    // Get a filtered list (for this guild only).
    const filtered = client.points.filter((p) => p.guild === message.guild.id);

    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const rightNow: Date = new Date();
    const toRemove = filtered.filter((data) => {
      return (
        !message.guild.members.has(data.user) || this.rightNow - 2592000000 > data.lastSeen
      );
    });

    toRemove.forEach((data) => {
      client.points.delete(`${message.guild.id} -${data.user} `);
    });

    message.channel.send(`Æ har fjærna ${toRemove.size} ubrukelige brukera.`);
  }
};
