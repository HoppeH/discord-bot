import { redisDB } from '../../service';
import { MessageEmbed } from 'discord.js';

export async function leaderboard(message) {
    const redisClient = redisDB.getRedisClient();
    // console.log(message.guild);
    const top10 = await redisDB.zrevrange([`leaderboard-${message.guild.id}`, "0", "9"])

    let embedCosmos = new MessageEmbed()
        .setTitle('Leaderboard')
        .setDescription('Top 10 users')
        .setColor(0x00ae86);
    let index = 1;
    for (let userId of top10) {
        const userData = await redisDB.hgetall(`${message.guild.id}-${userId}`)
        // message.channel.send(`Rank: ${index + 1} - ${data.userName} Level: ${data.level} Points: ${data.points}`)
        embedCosmos.addField(
            `#${index} - ${userData.userName}`,
            `Level: ${userData.level} - Points: ${userData.points}`
        );
        index++;
    }
    return message.channel.send(embedCosmos);
}