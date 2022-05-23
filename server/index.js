const { notDeepStrictEqual } = require('assert');
const { createSocket } = require('dgram');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

app.get('/', (req, res) => {
  res.send('It works');
});



io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('connect', ()=>{
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('user', ()=>
  {
  });

  socket.on('add user', (username)=>{
    socket.handshake.auth.username = username;
    socket.broadcast.emit('add user', username)
  })

  socket.on('users', ()=>{
    var users = [];
    for (let s of io.of('/').sockets) {
      users.push( {socketId: s[0], name: s[1]['handshake']['auth']['username']['username']})
    }
  })

  socket.on('message', (data) => {
    socket.broadcast.emit('messageBr', data);
  })

  socket.on('join', (id)=>{ 
    var room =io.sockets.adapter.rooms.get(id);
    if(!io.sockets.adapter.rooms.get(id)) {
      socket.join(id)
      //response that room is open now
      socket.broadcast.emit('newroom', id)
    }
    else if (room.size==1){
      socket.join(id)
      //response to close access to the room
      socket.broadcast.emit('fullroom', id)
      //alert the clients
      io.sockets.in(id).emit('fullroomJoin', id)
      }
  })

  socket.on('rooms', ()=>{
    rooms=[];
    keys= io.sockets.adapter.rooms.keys()
    for (let k of keys) {
      if (String(k).length==6)
      rooms.push(k)
    }
    socket.emit('rooms', rooms);
  })

  socket.on('setup', (id)=> {
    //id is a room id. this only emits to the partner
    socket.broadcast.emit('iam', socket.handshake.auth.username)
  })

  socket.on('destroy', (roomid)=> {
    console.log('destroy '+ roomid)
    io.socketsLeave(roomid);
  })

});



http.listen(3000, () => {
  console.log('listening on *:3000');
});