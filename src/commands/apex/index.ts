import { config } from '../../config';
const axios = require('axios');
const Discord = require('discord.js');
import { apexPlayer } from './apex-player'
import { apexLeaderboard } from './apex-leaderboard'

export const apexResponse = function (message) {
  const apiUrl = 'https://public-api.tracker.gg/apex/v1/standard/profile/5/';
  const apiEgil = 'http://localhost:3000/api/v01';

  if (message.content.toLowerCase().startsWith(config.prefix + 'apex')) {
    let args = message.content.split(' ').slice(1);
    if (!args[0]) return message.channel.send('Mangler navn');

    switch (args[0]) {
      case 'player':
        apexPlayer(message, args);
        break;

      case 'lb':
        switch (args[1]) {
          case 'damage':
            apexLeaderboard(message, args);
            break;

          case 'level':
            apexLeaderboard(message, args);
            break;

          case 'headshots':
            apexLeaderboard(message, args);
            break;

          case 'kills':
            apexLeaderboard(message, args);
            break;

          case 'help':
            message.channel.send(
              'Available leaderborad commands: kills |  level | damage. Example "!apex lb level"'
            );
            break;

          default:
            message.channel.send(
              'Sorry i did not find the leaderboard your looking for, try !apex lb help'
            );
        }

        break;

      case 'help':
        message.channel.send(
          'I am only able to collect data shown in your badges ingame, for me to collect data change your badges.'
        );
        message.channel.send(
          'Apex available commands: lb (leaderboard) | player'
        );
        break;

      default:
        message.channel.send(
          'Auda! Noe har gått galt!, fant ikke kommandoen ' + args[0]
        );
    }
  }
};

// export * from './apex-player'
// export * from './apex-leaderboard'