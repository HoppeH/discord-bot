import { editPoints } from "./";

export async function give(client, message, args) {

    // Limited to guild owner - adjust to your own preference!
    if (message.author.id !== message.guild.ownerID && !message.member.roles.cache.some(r => ["Admin"].includes(r.name)))
        return message.reply('Du e ikje sjæf,du kan ikje gjøre sånn!');

    // Kontroller at bruker er nevnt. 
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user)
        return message.reply('Æ må vette kem æ ska gje poeng (Klient ID eller @mention)!');

    // Sjekk at argument "Poeng parameteret eksisterer"
    if (!args[1] || args[1]?.length === 0)
        return message.reply('Du sa ikje kor mange poeng æ sku gje...');

    // Konverter poeng fra streng til tall
    const pointsToAdd: number = parseInt(args[1], 10);

    // Ikke hensiktsmessig å ikke endre poeng. 
    if (pointsToAdd === 0)
        return message.reply('Poenget med å gi 0 poeng... ?');

    // Sjekk at det er riktig datatype
    if (typeof pointsToAdd != 'number' || Number.isNaN(pointsToAdd))
        return message.reply('Feil datatype, poeng må angis i positive eller negativt tall. Feks -5')




    const editpointsREs = await editPoints(message, user, pointsToAdd);
    // redisDB.hincrby(key, "points", pointsToAdd);
    // redisDB.zincrby([`leaderboard-${message.guild.id}`, pointsToAdd, user.id])


    // Sende melding tilbake til kanalen
    message.channel.send(
        `${user.username} har fått ${pointsToAdd} poeng`
    );

}