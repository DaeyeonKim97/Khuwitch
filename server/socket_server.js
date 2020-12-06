const config = require('./config/config')

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const papago = require('./openAPIs/papago_api');


const tmi = require('tmi.js');
// Define configuration options
var opts = {
    identity: {
      username: process.env.BOT_USERNAME,
      password: process.env.OAUTH_TOKEN
    },
    channels: ["nnonuu"]
  };
// Create a client with our options
var client = new tmi.client(opts); //twitch chatbot client

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './testviews');

// client.opts.channels;
let a = 0;


app.get('/', (req, res) => {
    res.render('chat');
});

app.get('/list',(req,res) => {
    res.send(client.channels);
})

app.post('/add',async (req,res)=>{
  
  /// 봇을 새로운 채널에 추가
    await client.action(req.body.streamer,'Khuwitchbot이 입장');
    await opts.channels.push('#'+req.body.streamer);
    await delete client;
    client = await new tmi.client(opts);
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);
    client.connect();
    res.send(req.body.streamer)
  ///
})


io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('leaveRoom', (streamer,name) => {
        socket.leave(streamer, () => {
            console.log('Someone leave a ' + streamer);
            io.to(streamer).emit('leaveRoom', streamer ,name);
        });
    });

    socket.on('joinRoom', (streamer,name) => {
        socket.join(streamer, () => {
            console.log('Someone join a ' + streamer);
            io.to(streamer).emit('joinRoom', streamer ,name);
            console.log(streamer,io)
        });
    });

    socket.on('chat message', (streamer, name, msg) => {
        io.to(streamer).emit('chat message', name, msg);
    });
});


http.listen(process.env.SOCKET_PORT, () => {
    console.log(`Connect at ${process.env.SOCKET_PORT}`);
});


/////////////////////Twitch Bot//////////////////////////


// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();
console.log(client);

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  console.log("chatdetected")

  if (msg.startsWith('!')){
    return;
  }
  else if(context["display-name"] == "빵_떡" 
          || context["display-name"]=="Nightbot"
          || context["display-name"]=="싹뚝"){
    return;
  }
  else{
    io.to(target.replace('#','')).emit('chat message',context["display-name"],msg)
    papago.detectchat(msg, client, io, target);
  }
  
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`*KwitchBot Connected to ${addr}:${port}`);
}
