import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from './socket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pong';
  username="";
  
  data:any;

  constructor(private socketService: SocketService){ }

  ngOnInit(){

    this.data = new FormGroup({
      username: new FormControl("", Validators.required),
  });

    this.socketService.getCurrentId()
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }


  onSubmit(){
    this.username=this.data.value.username;
    this.socketService.registerUser(this.username);
  }
}
