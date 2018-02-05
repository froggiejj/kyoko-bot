/*
  Kyoko v1.0.0
  Built with discord.js
*/

// Import the discord.js module
const Discord = require('discord.js');
const auth = require("./auth.json");

const client = new Discord.Client();
if(auth.token == "YOUR-TOKEN-HERE")
{
  console.log("You need to enter the bot's access token in auth.json.");
  process.exit(1);
}
const token = auth.token;

client.on('ready', () => {
  console.log("Kyoko Online.");
});

// Declare functions to run on commands
function dance(msg)
{
	if(msg.member.voiceChannel)
	{
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
	else
	{
		msg.channel.send('Join a voice channel first, then try again.');
	}
}

// listen for new messages
var dispatcher = null;
client.on('message', message => {
  // If the message starts with ! and the user isn't a bot,
  if (message.toString().substring(0,1) === '!' && !message.author.bot)
  {
	//split rest of the message up
	var args = message.toString().substring(1).split(' ');
	var cmd = args[0];	// args[1:n] stores the arguments for the commands
    switch(cmd)
	   {
       //!hello, tests if the bot is alive
		   case 'hello':
			    message.channel.send('*nod*');
		   break;
     }
  }
  // If the bot is DM'ed and the DM is not from a bot,
  else if(message.channel.type == 'dm' && !message.author.bot)
  {
	  console.log("I was DM'ed.")
    message.channel.send("Thank you for DMing me!")
  }
});

// Log Kyoko in
client.login(token);
