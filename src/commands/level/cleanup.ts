import { redisDB } from '../../service';
import { removeUser } from './';

export async function cleanup(message, args) {

    const users = await redisDB.zrevrange([`leaderboard-${message.guild.id}`, "0", "-1"])
    const rightNow: Date = new Date();
    // let initial_date = new Date;

    for (let userId of users) {
        const userData = await redisDB.hgetall(`${message.guild.id}-${userId}`)

        if (rightNow.getTime() - 2592000000 > new Date(userData.lastSeen).getTime()) {
            message.channel.send(`Bruker Slettet: ${userData.userName} - ${userData.user}`);
            // console.log(userData);
            removeUser(message.guild.id, userData.user).then(console.log).catch(console.error);
        }
    }
}