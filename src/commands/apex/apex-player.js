const axios = require('axios');
const Discord = require('discord.js');
const config = require('./../../config.json');

const apiUrl = 'https://public-api.tracker.gg/apex/v1/standard/profile/5/';
const apiEgil = 'http://localhost:3000/api/v01';

exports.apexPlayer = function(message, args) {
  axios
    .get(apiUrl + '/' + args[1], {
      headers: {
        'TRN-API-KEY': config.apexApiToken
      }
    })
    .then(function(response) {
      let level = response.data.data.metadata.level;
      let username = response.data.data.metadata.platformUserHandle;
      let icon = response.data.data.children[0].metadata.icon;
      let legend = response.data.data.children[0].metadata.legend_name;
      let stats = response.data.data.stats;
      // console.log(stats[3]);
      const embed = new Discord.RichEmbed()

        .setTitle('Apex Legends!')
        .setDescription('Info for ' + username)
        //   .setImage('https://i.imgur.com/xxxxxxxx.png')
        //   .setURL('https://google.com')
        .addField('Legend: ', legend)

        //Nope
        .setThumbnail(icon)
        .setColor(0x00ae86)
        //   .setFooter('Dato')

        .setTimestamp();
      if (stats[0] !== undefined) {
        embed.addField('Level: ', stats[0].value);
      }
      if (stats[1] !== undefined) {
        let badge1 = response.data.data.stats[1].metadata.name;
        let badge1Value = response.data.data.stats[1].value;

        embed.addField('Badge 1: ', badge1 + ' - ' + badge1Value);
      }
      if (stats[2] !== undefined) {
        let badge2 = response.data.data.stats[2].metadata.name;
        let badge2Value = response.data.data.stats[2].value;

        embed.addField('Badge 2: ', badge2 + ' - ' + badge2Value);
      }
      if (stats[3] !== undefined) {
        let badge3 = response.data.data.stats[3].metadata.name;
        let badge3Value = response.data.data.stats[3].value;

        embed.addField('Badge 3: ', badge3 + ' - ' + badge3Value);
      }
      /*
       * Blank field, useful to create some space.
       */

      return message.channel.send(embed);
      // message.channel.send('Nivå: ' + response.data.metadata.level);
    })
    .catch(function(error) {
      if (error.response) {
        return message.channel.send(
          'Huffda! Jeg klarer ikke å finne stats om ``' + args[0] + '``'
        );
      } else if (error.request) {
        message.channel.send(
          'Auda! Noe har gått galt! ' + error.response.statusText
        );
      } else {
        console.log(error);
      }
    });
};
