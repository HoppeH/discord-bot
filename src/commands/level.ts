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
      .setDescription('Top 10 users')
      .setColor(0x00ae86);
    let index = 1;
    for (let userId of top10) {
      const userData = await redisDB.hgetall(`${message.guild.id}-${userId}`)
      // message.channel.send(`Rank: ${index + 1} - ${data.userName} Level: ${data.level} Points: ${data.points}`)
      embedCosmos.addField(
        `#${index} - ${userData.userName}`,
        `Level: ${userData.level} - Points: ${userData.points}`
      );
      index++;
    }
    return message.channel.send(embedCosmos);
  }


  if (command === 'give') {


    // Limited to guild owner - adjust to your own preference!
    if (message.author.id !== message.guild.ownerID && !message.member.roles.cache.some(r => ["Admin"].includes(r.name)))
      return message.reply('Du e ikje sjæf,du kan ikje gjøre sånn!');

    // Kontroller at bruker er nevnt. 
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user)
      return message.reply('Æ må vette kem æ ska gje poeng (Klient ID takk)!');

    // Sjekk at argument "Poeng parameteret eksisterer"
    if (!args[1] || args[1]?.length === 0)
      return message.reply('Du sa ikje kor mange poeng æ sku gje...');

    // Konverter poeng fra streng til tall
    const pointsToAdd: number = parseInt(args[1], 10);

    // Ikke hensiktsmessig å ikke endre poeng. 
    if (pointsToAdd === 0)
      return message.reply('Poenget med å gi 0 poeng... ?');

    // Sjekk at det er riktig datatype
    if (typeof pointsToAdd != 'number' || Number.isNaN(pointsToAdd))
      return message.reply('Feil datatype, poeng må angis i positive eller negativt tall. Feks -5')


    // Lager unik nøkkel for bruker som skal endres poeng på.
    const key = `${message.guild.id}-${user.id}`;

    redisDB.hincrby(key, "points", pointsToAdd);
    redisDB.zincrby([`leaderboard-${message.guild.id}`, pointsToAdd, user.id])


    // Sende melding tilbake til kanalen
    message.channel.send(
      `${user.username} har fått ${pointsToAdd} poeng`
    );
  }

  if (command === 'cleanup') {


    const users = await redisDB.zrevrange([`leaderboard-${message.guild.id}`, "0", "-1"])
    const rightNow: Date = new Date();
    // let initial_date = new Date;
    // let added30Min = new Date(initial_date.getTime() - (24*60*60*1000));


    for (let userId of users) {
      const userData = await redisDB.hgetall(`${message.guild.id}-${userId}`)
      // console.log(new Date(userData.lastSeen) instanceof Date);
      // console.log(new Date(userData.lastSeen).getTime());
      // console.log(rightNow.getTime() - 2592000000 > new Date(userData.lastSeen).getTime())
      if (rightNow.getTime() - 2592000000 > new Date(userData.lastSeen).getTime()) {
        message.channel.send(`Bruker Slettet: ${userData.userName} - ${userData.user}`);
        console.log(userData);
        removeUser(message.guild.id, userData.user).then(console.log).catch(console.error);
      }


    }

    // Let's clean up the database of all "old" users, and those who haven't been around for... say a month.

    // Get a filtered list (for this guild only).
    // const filtered = client.points.filter((p) => p.guild === message.guild.id);

    // // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // // So we get only users that haven't been online for a month, or are no longer in the guild.

    // const toRemove = filtered.filter((data) => {
    //   return (
    //     !message.guild.members.has(data.user) || this.rightNow - 2592000000 > data.lastSeen
    //   );
    // });

    // toRemove.forEach((data) => {
    //   client.points.delete(`${message.guild.id} -${data.user} `);
    // });

    // message.channel.send(`Æ har fjærna ${toRemove.size} ubrukelige brukera.`);
  }
};

export async function removeUser(guildKey: string, userKey: string) {


  console.log(`leaderboard-${guildKey}`, `${userKey}`);
  const delSortedSet = redisDB.zrem(`leaderboard-${guildKey}`, `${userKey}`)
  const delHash = redisDB.del(`${guildKey}-${userKey}`)

  return await Promise.all([delSortedSet, delHash]).then(data => console.log(`promise all ok`, data)).catch(err => console.error(err));



}


