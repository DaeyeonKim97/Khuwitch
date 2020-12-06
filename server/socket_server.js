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
    channels: ["tmwardo"]
  };
// Create a client with our options
var client = new tmi.client(opts); //twitch chatbot client

var bodyParser = require('body-parser');
const { default: Axios } = require('axios');
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
    var result = []
    for (var i = 0; i<client.channels.length; i++){
      result.push(client.channels[i].slice(1))
    }
    res.send(result)
});

app.post('/jointest',async (req,res)=>{
  // requests.post(`https://id.twitch.tv/oauth2/token?client_id=<클라이언트 ID>&client_secret=${process.env.TOKEN}&grant_type=client_credentials`).json()
  JoinChannel(req.body.streamer);
  res.send(req.body.streamer)
});

////////////////////////oauth////////////////////////
const axios = require('axios')
app.get('/oauth',(req,res)=>{
    let codeAddr = `https://id.twitch.tv/oauth2/authorize?response_type=code&approval_prompt=auto&redirect_uri=${process.env.HOST_URI+':'+process.env.SOCKET_PORT}/join&client_id=${process.env.TWITCH_CLIENT}`

    res.redirect(codeAddr)
});
app.get('/join', async (req,res)=>{
    let code = req.query.code
    let reqAddr = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT}&client_secret=${process.env.TWITCH_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.HOST_URI+':'+process.env.SOCKET_PORT}/test`
    axios.post(reqAddr).then(resp1=>{
        axios.get('https://id.twitch.tv/oauth2/validate',
              {
                  headers:{
                      Authorization : "Bearer "+ resp1.data.access_token
                  }
              }
        ).then(resp2=>{
            JoinChannel(resp2.data.login)
            res.send("Joinned "+resp2.data.login)
        })
    })
    
})

app.get('/test',(req,res)=>{
    res.send("")
})
////////////////////////oauth////////////////////////


async function JoinChannel(streamer){
    await client.action(streamer,'KhuwitchBot 두두등장');
    await opts.channels.push('#'+streamer);
    await delete client;
    client = await new tmi.client(opts);
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);
    client.connect();
} 


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

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  if (msg.startsWith('!')){
    if(msg.startsWith('!번역')){
      io.to(target.replace('#','')).emit('chat message',context["display-name"],msg.slice(4))
      papago.trans(msg.slice(4), client, io, target)
    }
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
