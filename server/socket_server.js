const config = require('./config/config')

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const papago = require('./openAPIs/papago_api');

// const tmi = require('tmi.js');
// // Define configuration options
// var opts = {
//     identity: {
//       username: process.env.BOT_USERNAME,
//       password: process.env.OAUTH_TOKEN
//     },
//     channels: [
//       'bachelorchuckchuck'
//     ]
//   };
// // Create a client with our options
// const client = new tmi.client(opts); //twitch chatbot client

app.set('view engine', 'ejs');
app.set('views', './server/testviews');

let room = ['streamer1', 'streamer2'];
// client.opts.channels;
let a = 0;


app.get('/', (req, res) => {
    res.render('chat');
});

app.get('/list',(req,res) => {
    res.send(room);
})

app.post('/add',(req,res)=>{
    room.append(req.body.streamer);
    res.send(req.body.streamer);
})


io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('leaveRoom', (num,name) => {
        socket.leave(room[num], () => {
            console.log('Someone leave a ' + room[num]);
            io.to(room[num]).emit('leaveRoom', num ,name);
        });
    });

    socket.on('joinRoom', (num,name) => {
        socket.join(room[num], () => {
            console.log('Someone join a ' + room[num]);
            io.to(room[num]).emit('joinRoom', num ,name);
        });
    });

    socket.on('chat message', (num, name, msg) => {
        papago.detect(msg,io,room[num]);
        io.to(room[a]).emit('chat message', name, msg);
    });
});

http.listen(process.env.SOCKET_PORT, () => {
    console.log(`Connect at ${process.env.SOCKET_PORT}`);
});

/////////////////////Twitch Bot//////////////////////////


// // Register our event handlers (defined below)
// client.on('message', onMessageHandler);
// client.on('connected', onConnectedHandler);

// // Connect to Twitch:
// client.connect();

// // Called every time a message comes in
// function onMessageHandler (target, context, msg, self) {
//   if (self) { return; } // Ignore messages from the bot
  
//   io.to(target).emit('chatmessage',)
//   papago.detectchat(msg, client, target);


//   if(msg == '척척학사'){
//     client.say(target, `안녕하세요 척척학사의 방송입니다.`);
//   }
  
// }

// // Called every time the bot connects to Twitch chat
// function onConnectedHandler (addr, port) {
//   console.log(`*KwitchBot Connected to ${addr}:${port}`);
// }
