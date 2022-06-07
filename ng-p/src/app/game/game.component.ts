import { AfterViewInit, Component, Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit{
  waiting: boolean = false
  roomId:string="";


  constructor(private socketService: SocketService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.socketService.getRooms()

    this.socketService.newRoom.subscribe((room: any) => {
      this.createRoomEntity(room)
      //
    })

    this.socketService.fullRoom.subscribe((room: any) => {
      console.log("remove" + room)
      this.removeRoomEntity(room)
      //
    })

    this.socketService.currentRoom.subscribe((room: any) => {
      console.log("current room : " + room)
      this.roomId=room;
      this.waiting=false
      //
    })


    this.socketService.rooms.subscribe((res: any) => {
      console.log("rooms in Game component" + res)
      for (var i=0; i< res.length; i++) {
        if (!this.getRoomExists(res[i]))
        this.createRoomEntity(res[i])

      }
    })
  }


  handleClick(event: any) {
    var target = event.target || event.srcElement || event.currentTarget;
    var id = (target as Element).id
    if (id == "default") {
      //create new room
      this.socketService.joinRoom("")
    }
    else {
      this.socketService.joinRoom(id)
    }
    this.waiting = true
  }

  addNewRoom(el: any) {
    var rooms = document.getElementById('roomList');
    rooms?.appendChild(el)
  }


  createRoomEntity(id: any) {
    console.log("id: " + id)
    const el = this.renderer.createElement('li');
    const button = this.renderer.createElement('button');
    this.renderer.setAttribute(button, 'id', id)
    this.renderer.listen(
      button,
      'click',
      (event: any) => this.handleClick(event)
    );
    button.innerHTML = "Join " + id
    el.appendChild(button);
    this.addNewRoom(el);
  }

  removeRoomEntity(id: any) {
    var room = document.getElementById(id);
    room?.remove()
  }


  getRoomExists(id:string) {
    var parent = document.querySelector("#roomList")
    var child = parent?.querySelector("[id='" + id + "']")
    return child
  }


}
