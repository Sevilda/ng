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
    //let player1 be the room's creator
    socket.broadcast.emit('iam', socket.handshake.auth.username, id!=socket.id.substring(0, 6))
    //emit a countdown
    io.sockets.in(id).emit('ready');
  })

  socket.on('destroy', (roomid)=> {
    console.log('destroy '+ roomid)
    io.sockets.in(roomid).emit('destroyRoom', roomid)
    io.socketsLeave(roomid);
  })


  socket.on('enemyUpdate', (id, status)=>{
    //broadcast to other sockets in the room.
    socket.broadcast.to(id).emit('enemyUpdate', status)
  })

  socket.on('score', (id, scores)=>{
    io.sockets.in(id).emit('wait', scores)
  })

  socket.on('ready', (id)=>{
    io.sockets.in(id).emit('ready')
  })
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});