import { config } from '../config'

export const setGame = (client, message, command, args) => {
  console.log('setgame', args);
  client.user.setPresence({ activity: { name: args[0], type: "PLAYING" } }).then(console.log).catch(console.error);
};



export const setStatus = (client, message, command, args) => {

  console.log('setStatus', args);

  client.user.setPresence({ status: args[0], activity: { name: `${args[0]}`, type: "PLAYING" } }).then(console.log).catch(console.error);

};

