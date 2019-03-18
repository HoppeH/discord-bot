const  config = require("./../config.json");
const fs = require("fs");
const prefix = "!";
const Discord = require('discord.js');
// const client = require('../index.js');

// const Enmap = require("enmap");
// client.points = new Enmap({name: "points"});

exports.levelresponse = function(client , message) {
  // console.log(client.points);
  if (message.guild) {
    // We'll use the key often enough that simplifying it is worth the trouble.
    const key = `${message.guild.id}-${message.author.id}`;

    // Triggers on new users we haven't seen before.
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1,
      lastSeen: new Date()
    });

    // Increment the points and save them.
    client.points.inc(key, "points");

    // Calculate the user's current level
    const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));

    // Act upon level up by sending a message and updating the user's level in enmap.
    if (client.points.get(key, "level") < curLevel) {
      message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
      client.points.set(key, curLevel, "level");
    }
  }

    // As usual, we stop processing if the message does not start with our prefix.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Also we use the config prefix to get our arguments and command:
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(config.prefix.length).toLowerCase();
  
    // Let's build some useful ones for our points system.
  
    if (command === "points") {
      const key = `${message.guild.id}-${message.author.id}`;
      return message.channel.send(`You currently have ${client.points.get(key, "points")} points, and are level ${client.points.get(key, "level")}!`);
    }
  
    if(command === "leaderboard") {
      // Get a filtered list (for this guild only), and convert to an array while we're at it.
      const filtered = client.points.array().filter( p => p.guild === message.guild.id );
  
      // Sort it to get the top results... well... at the top. Y'know.
      const sorted = filtered.sort((a, b) => b.points - a.points);
  
      // Slice it, dice it, get the top 10 of it!
      const top10 = sorted.splice(0, 10);
  
      
      // Now shake it and show it! (as a nice embed, too!)
      const embed = new Discord.RichEmbed()
        .setTitle("Leaderboard")
        .setAuthor(client.user.username, client.user.avatarURL)
        .setDescription("Our top 10 points leaders!")
        .setColor(0x00AE86);
      for(const data of top10) {
        embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
      }
      return message.channel.send({embed});
    }
    // console.log(message.guild.ownerID);
    if(command === "give") {
      // Limited to guild owner - adjust to your own preference!
      if(message.author.id !== message.guild.ownerID) return message.reply("You're not the boss of me, you can't do that!");
  
      const user = message.mentions.users.first() || client.users.get(args[0]);
      if(!user) return message.reply("You must mention someone or give their ID!");
  
      const pointsToAdd = parseInt(args[1], 10);
      if(!pointsToAdd) return message.reply("You didn't tell me how many points to give...");
  
      const key = `${message.guild.id}-${user.id}`;
  
      // Ensure there is a points entry for this user.
      client.points.ensure(key, {
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
        lastSeen: new Date()
      });
  
      // Add the points to the enmap for this user.
      client.points.math(key, "+", pointsToAdd, "points");
  
      message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${client.points.get(key, "points")} points.`);
    }
  
    if(command === "cleanup") {
      // Let's clean up the database of all "old" users, and those who haven't been around for... say a month.
  
      // Get a filtered list (for this guild only).
      const filtered = client.points.filter( p => p.guild === message.guild.id );
  
      // We then filter it again (ok we could just do this one, but for clarity's sake...)
      // So we get only users that haven't been online for a month, or are no longer in the guild.
      const rightNow = new Date();
      const toRemove = filtered.filter(data => {
        return !message.guild.members.has(data.user) || rightNow - 2592000000 > data.lastSeen;
      });
  
      toRemove.forEach(data => {
        client.points.delete(`${message.guild.id}-${data.user}`);
      });
  
      message.channel.send(`I've cleaned up ${toRemove.size} old farts.`);
    }

}
