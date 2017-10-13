const config = require("./../config.json");

exports.test =  function(client, message, args) {
  if (message.content.startsWith(config.prefix + "ping")) {
  message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms`);
  }
};
