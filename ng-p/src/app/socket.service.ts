import { Injectable, OnInit } from '@angular/core';
import { Observable, Observer, of, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{


  socket: any;
  messageData: Subject<any> = new Subject<any>();
  newUser:Subject<any> = new Subject<any>();
  newRoom:Subject<any> = new Subject<any>();
  fullRoom:Subject<any> = new Subject<any>();
  fullRoomJoin:Subject<any> = new Subject<any>();
  rooms:Subject<any> = new Subject<any>();
  playerData:Subject<any> = new Subject<any>();



  constructor() {    
    this.socket = io(environment.SOCKET_ENDPOINT)
    this.socket.on(('messageBr'), (data:any)=>{
      this.messageData.next(data)
    }); 

    this.socket.on('add user', (username:any)=> {
      this.newUser.next(username);
    })

    this.socket.on('newroom', (room:any)=> {
      this.newRoom.next(room);
    })

    this.socket.on('fullroom', (room:any)=> {
      this.fullRoom.next(room);
    })
    this.socket.on('fullroomJoin', (room:any)=> {
      this.fullRoomJoin.next(room);
    })

    this.socket.on('rooms', (res:any)=> {
      this.rooms.next(res)
    })

    this.socket.on('iam', (uname:any)=>{
      console.log({you: this.getUsername(), enemy: uname['username'] })
      this.playerData.next({you: this.getUsername(), enemy: uname['username'] })
    })

    

    }

  ngOnInit(): void {
  }

  users(){
    this.socket.emit('users')
  }

  disconnect() {
    if (this.socket) {
      this.socket.emit('disconnect');
    }
  }

  getCurrentId() {
    this.socket.emit('user');
  }

  registerUser(username: string) {
    this.socket.auth = { username }
    this.socket.emit('add user', { username })
    //console.log(this.socket);
  }

  getUsername() {
    return this.socket.auth.username;
  }

  sendMessage(data: any){
    this.socket.emit('message', data)
  }


  joinRoom(id:any){
    if (id){
      console.log("join " +  id)
      this.socket.emit('join', id.substring(0, 6))
  }
    else {
    console.log('join new', this.socket.id.substring(0, 6))
      this.socket.emit('join', this.socket.id.substring(0, 6))
    }
  }

  getRooms(){
    this.socket.emit('rooms')
  }

  giveRooms(){
    return this.rooms;
  }

  destroyRoom(id:string){
    this.socket.emit('destroy', id)
  }

  setup(id:string){
    this.socket.emit('setup', id)
  }



}
