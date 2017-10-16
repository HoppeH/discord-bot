const config = require("./../config.json");

exports.setgameresponse =  function (client , message) {

  let args = message.content.split(' ').slice(1);
  var argresult = args.join(' ');

if (message.content.startsWith(config.prefix + 'setgame')){
  client.user.setGame(argresult);

} else

if (message.content.startsWith(config.prefix + 'setstatus')){
client.user.setStatus(argresult);

}
};
