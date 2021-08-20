import { config } from './../config'

export const setGameStatus = (client, message, command, args) => {
  console.log('setGameStatus', args);
  client.user.setPresence({ activity: { name: args[0], type: "PLAYING" } }).then(console.log).catch(console.error);
};



export const setStatus = (client, message, command, args) => {

  console.log('setStatus', args);

  client.user.setPresence({ status: args[0], activity: { name0: `${args[0]}`, type: "PLAYING" } }).then(console.log).catch(console.error);

};

