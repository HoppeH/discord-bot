const config = require("./../config.json");
const fs = require("fs");
const prefix = "!";
let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

exports.setlevelresponse = function (client , message) {
    if (!points[message.author.id]) points[message.author.id] = {
      points: 0,
      level: 0
    }


    let userData = points[message.author.id];
    userData.points++;

    let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));

    // console.log('Points of user: ', curLevel);

    // La til .catch for å fange evt feil
    if (curLevel > userData.level) {
      // Level up!
      userData.level = curLevel;
      message.reply(`Du e level **${curLevel}**!`)
      //.catch(err => console.log(err));
    }
    // La til .catch for å fange evt feil
    if (message.content.startsWith(prefix + "level")) {
      message.reply(`Du e level ${userData.level}, med ${userData.points} poeng.`)
      //.catch(err => console.log(err));
    }

    // La til .catch for å fange evt feil
    if (message.content.startsWith(prefix + "points")) {
     message.reply(`Du har ${userData.points} poeng.`)
    // .catch(err => console.log(err));
    }
    return points;
}
