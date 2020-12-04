const tmi = require('tmi.js');
const papago = require('./openAPIs/papago_api')
const ttlserver = require('../socket_server')

// Define configuration options
var opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    'bachelorchuckchuck'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  
  client.say(target, `/color `+changecolor());
  papago.detectchat(msg, client, target);

  if(msg == '척척학사'){
    client.say(target, `안녕하세요 척척학사의 방송입니다.`);
  }
  
}

exports.addChannel = (channel) =>{
    opts.channels.append(channel);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
