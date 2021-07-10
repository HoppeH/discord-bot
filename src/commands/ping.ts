

export const pingResponse = (message, command) => {

  console.log('pingResponse')

  message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms`);

};
