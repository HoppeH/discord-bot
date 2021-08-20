
import { redisDB } from '../../service';

export const points = async (message) => {
    const key = `${message.guild.id}-${message.author.id}`;
    let { ...userData2 } = await redisDB.hgetall(key)


    return message.channel.send(
        `Du har ${userData2.points} poeng, å e level ${userData2.level}!`
    );

}