import { config } from './../config'

export const setgameresponse = (client, message, command, args) => {
  // let args = message.content.split(' ').slice(1);
  // var argresult = args.join(' ');
  // console.log(client.user);
  if (message.content.startsWith(config.prefix + 'setgame')) {
    client.user.setActivity(args[0], { type: 0 });
  } else if (message.content.startsWith(config.prefix + 'setstatus')) {
    console.log('Setstatus', args)
    // client.user.status(argresult);
    client.user.setActivity(args[0], { type: 1 });
  }
};
