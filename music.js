const Discord = require('discord.js')
const fs = require("fs");
const ytdl = require("ytdl-core");
const auth = require("./auth.json");

var server;
var client;
var voiceConnection = null;
var dispatcher = null;
var stopped = false;
var queue = [];

function playNextSong(){
  if(isQueueEmpty()){
    console.log("The Queue is Empty!");
  }
  if(dispatcher == null){
    console.log("I'm not in a channel!");
    return;
  }

  var videoID = queue[0]["id"];
  var title = queue[0]["title"];

  client.user.setActivity(title, { type: 'LISTENING' });

  var ytStream = ytdl("https://www.youtube.com/watch?v=" + videoID);
  voiceConnection = dispatcher.playStream(ytStream);
  console.log("Began playing: " + title);

  voiceConnection.once("end", reason => {
		voiceConnection = null;
		client.user.setActivity();
		if(!stopped && !isQueueEmpty()) {
			playNextSong();
		}
  });
  queue.splice(0,1);
}

function joinChannel(msg, voiceName){
  var voiceChannel = server.channels.find(chn => chn.name === voiceName && chn.type === "voice");
  if(voiceChannel == null){msg.reply("Couldn't find that channel"); }
  else{
    voiceChannel.join().then(connection => {dispatcher = connection;}).catch(console.error);
  }
}

function parseURL(videoURL){

  console.log(videoURL);

  let pos = videoURL.indexOf("=") + 1;
  if(pos == 0){
    pos = videoURL.lastIndexOf("/") + 1
  }

  let id = videoURL.slice(pos, pos+11);

  return id;
}

function addToQueue(videoURL){

  var videoID = parseURL(videoURL);

  // videoID = "iu7wJwbLkpo";
  console.log(`Adding ${videoID} to the queue...`);
  ytdl.getInfo("https://www.youtube.com/watch?v=" + videoID, (error, info) => {
		  if(error) {
			     console.log("Error (" + videoID + "): " + error);
		  }
      else {
			     queue.push({title: info["title"], id: videoID});
			     if(!stopped && !isBotPlaying() && queue.length === 1) {
				         playNextSong();
			     }
           console.log("Done!");
		       }
  });
}

function isBotPlaying(){
  return voiceConnection !== null;
}
function isQueueEmpty(){
  return queue.length === 0;
}

var commands = {

  grabData: function(serverData, clientData){
    server = serverData;
    client = clientData;
  },

  dmResponse: function(msg){
    // TODO: Create some kind of message filter so only youtube urls get through.
      addToQueue(msg.content);
      msg.channel.send("*Song added to queue.*");
  },

  playMusic: function(msg, args){
    if(joinChannel(msg, args[1]));
    console.log(`Joined channel ${args[1]}`);
  },

  stop: function(){
    stopped = true;
    if(voiceConnection != null){
      voiceConnection.end();
    }
  },

  resume: function(){
    stopped = false;
    if(dispatcher != null){
      playNextSong();
    }
  },

  clearqueue: function(){
    queue = [];
  }

};
module.exports = commands;
