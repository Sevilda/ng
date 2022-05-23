import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {User} from '../model/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = this.socket.fromEvent<User>('user');
  users = this.socket.fromEvent<string[]>('users');

  constructor(private socket: Socket) { }

  getSocketId(user:string) {
    this.socket.emit('getId', user);
  }
}
