const config = require('./config/config')

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const papago = require('./openAPIs/papago_api')

app.set('view engine', 'ejs');
app.set('views', './views');

let room = ['streamer1', 'streamer2'];
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

    socket.on('chat message', (num,name, msg) => {
        papago.detect(msg,io,room[num]);
        io.to(room[a]).emit('chat message', name, msg);
    });
});


http.listen(process.env.SOCKET_PORT, () => {
    console.log(`Connect at ${process.env.SOCKET_PORT}`);
});