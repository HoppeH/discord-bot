import { config } from '../config';

export const pingResponse = function (message) {
  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms`);
  }
};
