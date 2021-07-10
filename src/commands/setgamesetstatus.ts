import { config } from './../config'

export const setgameresponse = (client, message) => {
  let args = message.content.split(' ').slice(1);
  var argresult = args.join(' ');
  console.log(client.user);
  if (message.content.startsWith(config.prefix + 'setgame')) {
    client.user.setActivity(argresult, { type: 'Watching' });
  } else if (message.content.startsWith(config.prefix + 'setstatus')) {
    // client.user.status(argresult);
  }
};
