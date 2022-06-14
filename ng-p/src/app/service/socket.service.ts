import { HttpClient } from '@angular/common/http';
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
  deleteRoom:Subject<any> = new Subject<any>();
  currentRoom:Subject<any> = new Subject<any>();
  rooms:Subject<any> = new Subject<any>();
  playerData:Subject<any> = new Subject<any>();
  enemyBat:Subject<any> = new Subject<any>();
  readyRoom:Subject<any> = new Subject<any>();



  constructor(private http: HttpClient) {    
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
      this.currentRoom.next(room);
    })

    this.socket.on('rooms', (res:any)=> {
      this.rooms.next(res)
    })

    this.socket.on('iam', (uname:any, playerNo:boolean)=>{
      console.log({you: this.getUsername(), enemy: uname['username'] })
      this.playerData.next({you: this.getUsername(), enemy: uname['username'], isplayer1: playerNo })
    })

    this.socket.on('destroyRoom', (id:any)=>{
      console.log(id);
      this.currentRoom.next("");
      this.deleteRoom.next(id)
    })

    this.socket.on('enemyUpdate', (stat:any)=>{
      this.enemyBat.next({status:stat })
    })

    this.socket.on('ready', ()=>{
      this.readyRoom.next({ready: "true"});
    })

    this.socket.on('wait', (scores:number[])=>{
      this.readyRoom.next({ready: "false", score:scores});
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


  enemyUpdate(id:string, status:string){
    this.socket.emit('enemyUpdate', id, status)
  }

  score(id:string, scores:number[]){
    //wait after scoring
    this.socket.emit('score', id, scores)
  }

  ready(id:string){
    this.socket.emit('ready', id)
  }

  getScoreboard(): Observable<any>
    {
      return this.http.get('http://localhost:3000/scores')
    }

      win(usernames:string[], scores:number[]){
        this.socket.emit('win', usernames, scores)
      }


}
