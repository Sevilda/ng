import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-pong-game',
  templateUrl: './pong-game.component.html',
  styleUrls: ['./pong-game.component.css']
})
export class PongGameComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  @Input() roomId:string="";
  @Output() roomIdChange = new EventEmitter<string>();
  playerData: any;


  ngOnInit(): void {

    this.socketService.setup(this.roomId);
    this.socketService.playerData.subscribe((data: any) => {
      console.log(data)
      this.playerData=data;
    })
  }

  destroyRoom(){
    //disconnect from room
    this.socketService.destroyRoom(this.roomId);
    this.roomId="";
    //return empty roomId to game component
    this.roomIdChange.emit(this.roomId)

  }

}
