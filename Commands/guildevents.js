const config = require("./config.json");

//guild
client.on('guildMemberAdd', member => {
let guild = member.guild
guild.defaultChannel.sendMessage('Velkommen ${member.user.username} Te servern')
});

client.on('guildMemberRemove', member => {
let guild = member.guild
guild.defaultChannel.sendMessage('hadebra ${member.user.username} Vi snakkes')
//client
