const axios = require('axios');
const Discord = require('discord.js');
const config = require('./../../config.json');

const apiUrl = 'https://public-api.tracker.gg/apex/v1/standard/profile/5/';
const apiEgil = 'http://192.168.1.114:3000/api/v01';

exports.apexLeaderboard = function(message, args) {
  console.log(apiEgil + '/leaderboard/' + args[1]);
  axios
    .get(apiEgil + '/leaderboard/' + args[1], {
      // headers: {
      //   'TRN-API-KEY': config.apexApiToken
      // }
    })
    .then(function(response) {
      // console.log(response.data.data.records);
      const data = response.data.data.records;
      const embed = new Discord.RichEmbed()

        .setTitle(`Apex ${args[1]} leaderboard, oppdatert: ${data.LoggTime}`)
        .setDescription(' ')
        .setColor(0x00ae86)

        .setTimestamp();

      data.map(lb => {
        embed.addField(
          `${lb.PlayerName}`,
          `${lb.LoggParameter}: ${lb.LoggValue}`
        );
      });
      return message.channel.send(embed);
    })
    .catch(function(error) {
      if (error.response) {
        return message.channel.send(
          'Huffda! Jeg klarer ikke å finne stats om ``' + args[0] + '``'
        );
      } else if (error.request) {
        message.channel.send('Auda! Noe har gått galt! ' + error);
      } else {
        console.log(error);
      }
    });
};
