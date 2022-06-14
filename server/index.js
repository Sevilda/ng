
const {  addUser, addLog, logoutUser, getLoggedInUsers, getLogs, getScoreboard, addScore } = require('./db');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

app.get('/', (req, res) => {
  res.send('It works');
});

app.get('/users', async (req, res)=>{
  var data = await getLoggedInUsers()
  res.json(data)
})

app.get('/logs', async (req, res)=>{
  var data = await getLogs()
  res.json(data)
})

app.get('/scores', async (req, res)=>{
  var data = await getScoreboard()
  res.json(data)
})


io.on('connection', (socket) => {
  console.log('a user connected');
  addLog("socket", "connected", socket.id)

  socket.on('connect', ()=>{
    
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    logoutUser(socket.id)
    addLog("socket", "disconnected", socket.id)
  });


  socket.on('add user', (username)=>{
    socket.handshake.auth.username = username;
    socket.broadcast.emit('add user', username)

    addUser(username["username"], socket.id)
    addLog("socket", "assigned username", socket.id)
  })

  socket.on('users', ()=>{
    var users = [];
    for (let s of io.of('/').sockets) {
      users.push( {socketId: s[0], name: s[1]['handshake']['auth']['username']['username']})
    }
  })

  socket.on('message', (data) => {
    socket.broadcast.emit('messageBr', data);
    addLog("socket", "sent message", socket.id)
  })

  socket.on('join', (id)=>{ 
    var room =io.sockets.adapter.rooms.get(id);
    if(!io.sockets.adapter.rooms.get(id)) {
      socket.join(id)
      //response that room is open now
      socket.broadcast.emit('newroom', id)
      addLog("room", "created", id)
      addLog("socket", "joined room: " +id, socket.id)

    }
    else if (room.size==1){
      socket.join(id)
      //response to close access to the room
      socket.broadcast.emit('fullroom', id)
      //alert the clients
      io.sockets.in(id).emit('fullroomJoin', id)
      addLog("socket", "joined room: " +id, socket.id)
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
    addLog("room", "ready", id)
  })

  socket.on('destroy', (roomid)=> {
    io.sockets.in(roomid).emit('destroyRoom', roomid)
    io.socketsLeave(roomid);
    addLog("room", "destroyed", roomid)
  })


  socket.on('enemyUpdate', (id, status)=>{
    //broadcast to other sockets in the room.
    socket.broadcast.to(id).emit('enemyUpdate', status)
  })

  socket.on('score', (id, scores)=>{
    io.sockets.in(id).emit('wait', scores)
    addLog("socket", "scored", socket.id)
  })

  socket.on('win', (username, score)=>{
    addScore(username[0], score[0])
    addScore(username[1], score[1])
  })

  socket.on('ready', (id)=>{
    io.sockets.in(id).emit('ready')
  })
});


http.listen(3000, () => {
  console.log('listening on *:3000');
  addLog("log", "server started", "")
});

process.on('SIGINT', function(){
  addLog("log", "server stopped", "")
  console.log('stopping server')
  setTimeout(() => {
    process.exit(0);
  }, 1000);
})