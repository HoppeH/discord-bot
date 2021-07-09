import { config } from '../config'
import { redisDB } from '../service';
// const config = require('./../config.json');
const fs = require('fs');
const prefix = '!';
const Discord = require('discord.js');
// const client = require('../index.js');
// const levelsDb = require('./levelsDb');

const axios = require('axios');
// const Enmap = require("enmap");
// client.points = new Enmap({name: "points"});

const apiUrl = 'http://home.hoppeh.no:3333';

export const levelManagement = async function (client, message) {
  // console.log(message.guild);
  if (message.guild) {
    // We'll use the key often enough that simplifying it is worth the trouble.
    const key = `${message.guild.id}-${message.author.id}`;



    // let userData = await redisDB.hgetall(key).then(data => { console.log(data) });
    let { ...userData } = await redisDB.hgetall(key);
    console.log(userData && Object.keys(userData).length === 0 && userData.constructor === Object)
    if (userData && Object.keys(userData).length === 0 && userData.constructor === Object) {
      const initialUser = [
        "user", message.author.id,
        "guild", message.guild.id,
        "points", 1,
        "level", 1,
        "lastSeen", new Date(),]


      redisDB._hmset(key, initialUser)
    }

    redisDB.hincrby(key, "points", message.content.length);
    redisDB.hmset(key, ["lastSeen", new Date()])
    userData.points++


    const userId = message.author.id;
    const guildId = message.guild.id;
    const username = message.author.username;
    const DTOuser = { userId, guildId, username };



    // Calculate the user's current level
    const curLevel = Math.floor(
      0.1 * Math.sqrt(userData.points)
    );

    // Act upon level up by sending a message and updating the user's level in enmap.
    if (userData.level < curLevel) {
      message.reply(
        `Du levla opp te level **${curLevel}**! Va ikje det flott ?`
      );
      redisDB.hincrby(key, "level", 1);
      userData.level++
    }
  }

};
