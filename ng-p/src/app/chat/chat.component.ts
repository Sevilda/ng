import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private socketservice: SocketService) { }


  ngOnInit(): void {

    this.socketservice.messageData.subscribe((data:any)=>{
      var user=data['user']
      var message= data['message']
      this.addChatMessage(user, message)
    })

    this.socketservice.newUser.subscribe((uname:any)=>{
      console.log(uname['username'])
      this.log(uname['username'] + " has joined the chat.")
    })

  }


  // system messages
  log = (message: string) => {
    const el = document.createElement('li');
    el.setAttribute('class', 'log');
    el.innerText = message;
    this.addMessageElement(el);
  }

  addChatMessage = (user: string, message: any) => {
    const div = document.createElement('div')
    div.setAttribute('class', 'message');
    const el = document.createElement('li');
    el.setAttribute('style', 'color:' + this.randColor(user))
    el.innerText = user + ": " + message;
    div.appendChild(el);
    this.addMessageElement(div);
  }

  randColor(user:string) {
    var color= ["#514771", "#828FB2", "#825C7A", "#9E7373", "#C5A18F", "#89BEC4" ]
    var index=0;
    for (let i = 0; i < user.length; i++) {
      index=+user.charCodeAt(i);
    }
    return color[index%6];
  }

  addMessageElement = (el: any) => {
    var messages = document.getElementById('messages');
    messages?.appendChild(el)
  }

  onEnter(event: any) {
    var user = this.socketservice.getUsername();
    var message= event.target.value
    if (user && message) {
      this.socketservice.sendMessage({user, message})
      this.addChatMessage(user, message)
      event.target.value=""
    }
  }

}
