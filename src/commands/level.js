const config = require('./../config.json');
const fs = require('fs');
const prefix = '!';
const Discord = require('discord.js');
// const client = require('../index.js');

const levelsDb = require('./levelsDb');

const axios = require('axios');
// const Enmap = require("enmap");
// client.points = new Enmap({name: "points"});

const apiUrl = 'http://home.hoppeh.no:3333';

exports.levelresponse = async function (client, message) {
  // console.log(client.points);
  if (message.guild) {
    // We'll use the key often enough that simplifying it is worth the trouble.
    const key = `${message.guild.id}-${message.author.id}`;

    const userId = message.author.id;
    const guildId = message.guild.id;
    const username = message.author.username;

    DTOuser = { userId, guildId, username };

    // console.log(message.author.username);
    levelsDb.incrementScore(userId, guildId, username);

    // axios
    //   .post(apiUrl + '/incrementscore', {
    //     userId: message.author.id,
    //     guildId: message.guild.id,
    //     username: message.author.username,
    //   })
    //   .then((data) => console.log(`Response from Increment`))
    //   .catch((err) => console.log(`Err from increment`, err));

    // Triggers on new users we haven't seen before.
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1,
      lastSeen: new Date(),
    });

    // Increment the points and save them.
    client.points.inc(key, 'points');

    // Calculate the user's current level
    const curLevel = Math.floor(
      0.1 * Math.sqrt(client.points.get(key, 'points'))
    );

    // Act upon level up by sending a message and updating the user's level in enmap.
    if (client.points.get(key, 'level') < curLevel) {
      message.reply(
        `Du levla opp te level **${curLevel}**! Va ikje det flott ?`
      );
      client.points.set(key, curLevel, 'level');
    }
  }

  // As usual, we stop processing if the message does not start with our prefix.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Also we use the config prefix to get our arguments and command:
  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(config.prefix.length).toLowerCase();

  // Let's build some useful ones for our points system.

  if (command === 'points') {
    const key = `${message.guild.id}-${message.author.id}`;

    levelsDb.getUser;

    return message.channel.send(
      `Du har ${client.points.get(
        key,
        'points'
      )} poeng, å e level ${client.points.get(key, 'level')}!`
    );
  }

  if (command === 'leaderboard') {
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
    //     `${data.points} points (level ${data.level})`
    //   );
    // }

    axios
      .post(apiUrl + '/leaderboard', {
        userId: message.author.id,
        guildId: message.guild.id,
        username: message.author.username,
      })
      .then((res) => {
        console.log(`Response from leaderboard`);

        let embedCosmos = new Discord.MessageEmbed()
          .setTitle('Leaderboard')
          .setAuthor('HoppeH')
          .setDescription('Top 10 brukera!')
          .setColor(0x00ae86);

        for (let item of res.data) {
          // console.log(item.$1);
          embedCosmos.addField(
            item.$1.username,
            `${item.$1.points} points (level ${item.$1.level})`
          );
        }
        console.log(embedCosmos);
        return message.channel.send({ embedCosmos });
      })
      .catch((err) => console.log(`Err from leaderboard`, err));

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

    const key = `${message.guild.id}-${user.id}`;

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
      )} points.`
    );
  }

  if (command === 'cleanup') {
    // Let's clean up the database of all "old" users, and those who haven't been around for... say a month.

    // Get a filtered list (for this guild only).
    const filtered = client.points.filter((p) => p.guild === message.guild.id);

    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const rightNow = new Date();
    const toRemove = filtered.filter((data) => {
      return (
        !message.guild.members.has(data.user) ||
        rightNow - 2592000000 > data.lastSeen
      );
    });

    toRemove.forEach((data) => {
      client.points.delete(`${message.guild.id}-${data.user}`);
    });

    message.channel.send(`Æ har fjærna ${toRemove.size} ubrukelige brukera.`);
  }
};
