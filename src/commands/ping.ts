

export const pingResponse = (message, command) => {
  const dato = new Date;
  const messageDate = new Date(message.createdTimestamp)
  console.log('pingResponse')
  message.channel.send(`Pong! - Delay:${Date.now() - message.createdTimestamp} ms`);


};
