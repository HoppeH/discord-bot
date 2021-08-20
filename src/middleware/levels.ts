import { config } from '../config'
import { User } from '../interface';
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

  if (message.author.bot) return;

  // console.log(message.guild);
  if (message.guild) {
    // We'll use the key often enough that simplifying it is worth the trouble.
    const key = `${message.guild.id}-${message.author.id}`;


    // Get data from Redis for user.
    let { ...userData } = await redisDB.hgetall(key);

    // console.log(message.author);
    // Check if user exist ing Redis DB / If not add user to database. 
    if (userData && Object.keys(userData).length === 0 && userData.constructor === Object) {
      const initialUser: User[] = [
        "user", message.author.id,
        "userName", message.author.username,
        "guild", message.guild.id,
        "points", 1,
        "level", 1,
        "lastSeen", new Date()]
      redisDB._hmset(key, initialUser);
      redisDB.zadd([`leaderboard-${message.guild.id}`, 1, message.author.id]);
    }

    // Increment / update points and last seen in Redis DB
    redisDB.hincrby(key, "points", message.content.length);
    redisDB.zincrby([`leaderboard-${message.guild.id}`, message.content.length, message.author.id])
    redisDB.hmset(key, ["lastSeen", new Date()])
    redisDB.xadd('testStreasm', message.author.id, `${message.content.length}`);
    userData.points++


    // Calculate the user's current level
    const curLevel = Math.floor(
      0.1 * Math.sqrt(userData.points)
    );
    const levelDiff = curLevel - userData.level

    // Act upon level up by sending a message and updating the user's level in enmap.
    if (levelDiff > 0) {
      message.reply(
        `Du levla har gått opp ${levelDiff} level og e nu level **${curLevel}**! Va ikje det flott ?`
      );

      redisDB.hincrby(key, "level", levelDiff);
      userData.level++
    }
    if (levelDiff < 0) {
      message.reply(
        `Haha du gikk ned ${levelDiff} nivå og e nu level **${curLevel}**! Va ikje det flott ?`
      );

      redisDB.hincrby(key, "level", levelDiff);
      userData.level = userData.level - levelDiff
    }
  }

};
