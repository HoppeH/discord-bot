const config = require('./../config.json');
const axios = require('axios');
exports.apexResponse = function(message) {
  //     if (message.content.startsWith(config.prefix + "ping")) {
  //     message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms`);
  //   }
  const apiUrl = 'https://public-api.tracker.gg/apex/v1/standard/profile/5/';
  if (message.content.startsWith(config.prefix + 'apex')) {
    let args = message.content.split(' ').slice(1);
    if (!args[0]) return message.channel.send('Mangler navn');

    axios
      .get(apiUrl + '/' + args[0], {
        headers: {
          'TRN-API-KEY': config.apexApiToken
        }
      })
      .then(function(response) {
        let level = response.data.data.metadata.level;
        let username = response.data.data.metadata.platformUserHandle;

        console.log(response.data.data.metadata.level);
        message.channel.send(username + ' er nivå: ' + level);
        // message.channel.send('Nivå: ' + response.data.metadata.level);
      })
      .catch(function(error) {
        console.log(error);
      });
    console.log(args);
  }
};
