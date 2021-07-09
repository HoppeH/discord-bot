import { config } from './../config'

const axios = require('axios');

// const apiUrl = 'http://home.hoppeh.no:3333';



exports.incrementScore = (userId, guildId, username) => {
  axios
    .post(config.apiUrl + '/incrementscore', {
      userId,
      guildId,
      username,
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

exports.getUser = (userId, guildId, username) => {
  console.log(username);
  axios
    .post(config.apiUrl + '/getuser', {
      userId,
      guildId,
      username,
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};
