const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = "!";


client.on("ready", () => {
  console.log("I am ready!");
});


let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

// Sjekker innhold i points før det er endret
// console.log('Points start: ', points);

client.on("message", message => {

	 if (!message.content.startsWith(config.prefix) || message.author.bot) return;

   // La til .catch for å fange evt feil
  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send("pong!")
    .catch(err => console.log(err));
  } else
  // La til .catch for å fange evt feil
  if (message.content.startsWith(config.prefix + "foo")) {
    message.channel.send("bar!")
    .catch(err => console.log(err));
  }

  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };


  let userData = points[message.author.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));

  console.log('Points of user: ', curLevel);

  // La til .catch for å fange evt feil
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`You"ve leveled up to level **${curLevel}**! Ain"t that dandy?`)
    .catch(err => console.log(err));
  }

// Disse trengs ikke da de tilsvarende linje 18 gjøre det samme som disse.
// if (!message.content.startsWith(prefix)) return;
//   if (message.author.bot) return;

// La til .catch for å fange evt feil
  if (message.content.startsWith(prefix + "level")) {
    message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`)
    .catch(err => console.log(err));
  }

  // La til .catch for å fange evt feil
 if (message.content.startsWith(prefix + "points")) {
	 message.reply(`You currently have ${userData.points} points.`)
   .catch(err => console.log(err));
 }

// sjekke innhold i points etter det er endret
console.log('Points end: ', points);

 fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
  });
});

// La til .catch for å fange evt feil
client.login(config.token)
.catch(err => console.log(err));
