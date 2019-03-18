exports.run = (client, message, args) => {
  console.log(args);
  let reason = args.slice (1).join(' ');
  let user = message.mentions.user.first();
  let modlog = client.channel.find('name', 'mod-log');
  if (!modlog) return message.reply('Finner ikke en mod-log kanal');
  console.log(reason);
 if (message.mentions.users.size < 1) return message.reply ('Du må nevne nån før å advare dæm').catch(console.error);

};

exports.conf = {
  enabled: true,
  guildOnly:false,
  aliases:[],
  permLevel: 0
};

exports.help = {
  name: 'warn',
  description : 'Advarer en bruker.',
  usage: 'Warn [mention]'

};
