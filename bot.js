/*
  Kyoko v1.1.0
  Built with discord.js
*/

// Import the discord.js module
const fs = require("fs");
const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const auth = require("./auth.json");
const music = require("./music.js")

const client = new Discord.Client();
if(auth.token == "YOUR-TOKEN-HERE"){
  console.log("You need to enter the bot's access token in auth.json.");
  process.exit(1);
}
const token = auth.token;

client.on('ready', () => {
  console.log("Kyoko Online.");
  var server = client.guilds.find("name", "Saxy Beasts");
  music.grabData(server, client);
});

// Declare functions to run on commands
function dance(msg){
	if(msg.member.voiceChannel){
		msg.member.voiceChannel.join()
		.then(connection => {
      console.log(`Joined the voice channel ${msg.member.voiceChannel.name}.`)
			msg.channel.send('I\'m gonna tear up the fuckin\' dance floor.');

			dispatcher = connection.playFile('./GetDownSaturdayNight.mp3');
      console.log("Began playing Get Down Saturday Night.")

			dispatcher.on('end', () => {
			connection.disconnect();
      console.log("Left the voice channel.")
			});
		});
	}
	else{
		msg.channel.send('Join a voice channel first, then try again.');
	}
}

// listen for new messages
var dispatcher = null;
client.on('message', message => {
  // If the message starts with ! and the user isn't a bot,
  if (message.toString().substring(0,1) === '!' && !message.author.bot){
	//split rest of the message up
	var args = message.toString().substring(1).split(' ');
	var cmd = args[0];	// args[1:n] stores the arguments for the commands
    switch(cmd){
      //!hello, tests if the bot is alive
		  case 'hello':
			   message.channel.send('*nod*');
		  break;
      case 'music':
          music.playMusic(message, args);
      break;
      case 'stop':
        music.stop();
      break;
      case 'resume':
        music.resume();
      break;
      case 'clearqueue':
        music.clearqueue();
      break;
     }
  }
  // If the bot is DM'ed and the DM is not from a bot,
  else if(message.channel.type == 'dm' && !message.author.bot){
    music.dmResponse(message);
  }
});

// Log Kyoko in
client.login(token);
