const config = require("./../config.json");

exports.guildevents = (client, message) => {
  //guild
  client.on('guildMemberAdd', member => {
    let guild = member.guild
    guild.defaultChannel.sendMessage('Velkommen ${member.user.username} Te servern');
  });

  client.on('guildMemberRemove', member => {
    let guild = member.guild;
    guild.defaultChannel.sendMessage('Hadebra ${member.user.username} Vi snakkes');
    //client
  });
}
