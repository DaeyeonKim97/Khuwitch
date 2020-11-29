const config = require(__dirname + '/config/config')

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.SOCKET_PORT;

server.listen(port, () => { console.log(`Listening on port ${port}`) });

io.on('connection', socket => {
    console.log("connected socketID : ", socket.id);
    io.to(socket.id).emit('my socket id',{socketId: socket.id});

    socket.on('enter chatroom', () => {
        console.log("channel에 입장");
        socket.broadcast.emit('receive chat', {type: "alert", chat: "누군가가 입장하였습니다.", regDate: Date.now()});
    })

    socket.on('send voice', data => {
        console.log(`${socket.id} : ${data.chat}`);
        io.emit('send voice', data);
    })

    socket.on('leave chatroom', data => {
        console.log('leave chatroom ', data);
        socket.broadcast.emit('receive chat', {type: "alert", chat: "누군가가 퇴장하였습니다.", regDate: Date.now()});
    })
   
})