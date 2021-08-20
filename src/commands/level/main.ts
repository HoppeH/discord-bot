import { config } from '../../config'
import { redisDB } from '../../service';
import { cleanup } from './cleanup';
import { give } from './give'
import { leaderboard } from './leaderboard';
import { points } from './points';


export const userHandler = (client, message, command, args) => {

    const userMessages: {} = {
        'leaderboard': (): any => {
            return leaderboard(message);
        },
        'give': (): any => {
            return give(client, message, args);
        },
        'cleanup': (): any => {
            return cleanup(message, args);
        },
        'points': (): any => {
            return points(message);
        },
        'multi': (): any => {
            return testMulti(client, message);
        },
        'default': (): any => {
            console.error('No matching command type');
            return console.log(args);
        }
    };

    return (userMessages[command] || userMessages['default'])();
}

export const removeUser = async (guildKey: string, userKey: string) => {
    console.log(`leaderboard-${guildKey}`, `${userKey}`);
    const delSortedSet = redisDB.zrem(`leaderboard-${guildKey}`, `${userKey}`)
    const delHash = redisDB.del(`${guildKey}-${userKey}`)

    return await Promise.all([delSortedSet, delHash]).then(data => console.log(`promise all ok`, data)).catch(err => console.error(err));
}

export const editPoints = async (message, user, pointsToAdd) => {

    // Lager unik nøkkel for bruker som skal endres poeng på.
    const key = `${message.guild.id}-${user.id}`;

    const changeHash = await redisDB.hincrby(key, "points", pointsToAdd);
    const changeSortedSet = await redisDB.zincrby([`leaderboard-${message.guild.id}`, pointsToAdd, user.id])
    return await Promise.all([changeHash, changeSortedSet])
}

const testMulti = (client, message) => {
    const redisClient = redisDB.getRedisClient();
    redisClient.multi()
        .dbsize()
        .set("test", "test1")
        .exec((err, res) => {
            if (err) throw err;
            if (res === null) {
                message.channel.send(`transaction aborted because results were null`);
                console.log("transaction aborted because results were null");
            } else {
                message.channel.send("transaction completed", res);
                console.log("transaction worked and returned", res);
            }
        })
}