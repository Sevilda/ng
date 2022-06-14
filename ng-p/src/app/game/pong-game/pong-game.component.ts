import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/service/socket.service';

const CANVAS_WIDTH: number = 800;
const CANVAS_HEIGHT: number = 500;
const BAT_HEIGHT: number = 100;
const BAT_WIDTH: number = 10;
const BAT_SPEED: number = 20
const BAT_X: number[] = [20, 770];
const BALL_RADIUS: number = 10;


@Component({
  selector: 'app-pong-game',
  templateUrl: './pong-game.component.html',
  styleUrls: ['./pong-game.component.css']
})
export class PongGameComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  @Input() roomId: string = "";
  @Output() roomIdChange = new EventEmitter<string>();
  //[you, enemy, isPlayer1]
  playerData: any;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  BAT_Y: number[] = [200, 200];
  BALL: number[] = [400, 250];
  BALL_SPEED: number[];
  scores: number[] = [0, 0];
  ctx: CanvasRenderingContext2D;

  ballAni: any;
  canvasAni: any;

  winner: any = null;

  ready: boolean;


  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawCanvas();

    this.ready = true;

    this.socketService.setup(this.roomId);
    this.socketService.playerData.subscribe((data: any) => {
      this.playerData = data;
    })

    this.socketService.readyRoom.subscribe((data: any) => {

      if (data["score"]) {

      }

      if (data["ready"] == "true") {
        this.setStartValues()
        setTimeout(() => {
          this.ready = true
          this.moveBall()
        }, 2000);
      }
      else {
        this.ready = false
        this.scores = data["score"]
        window.cancelAnimationFrame(this.ballAni)
        this.setStartValues()

        //winconditions
        if (data["score"][0] >= 2) {
          //p1 wins. win for self, if p1 is self. 
          this.winner = this.playerData["isplayer1"] ? this.playerData["you"] : this.playerData["enemy"]
          window.cancelAnimationFrame(this.canvasAni)
          this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
          this.canvas.nativeElement.parentNode?.removeChild(this.canvas.nativeElement)
          //emit scores on win
          if (this.playerData["isplayer1"])
            this.socketService.win([this.playerData["you"], this.playerData["enemy"]],[this.scores[0]-this.scores[1]+7, this.scores[1]-this.scores[0]+7])
        }
        else if (data["score"][1] >= 2) {
          this.winner = this.playerData["isplayer1"] ? this.playerData["enemy"] : this.playerData["you"]
          window.cancelAnimationFrame(this.canvasAni)
          this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
          this.canvas.nativeElement.parentNode?.removeChild(this.canvas.nativeElement)
          //emit scores on win
          if (!this.playerData["isplayer1"])
            this.socketService.win([this.playerData["you"], this.playerData["enemy"]],[this.scores[1]-this.scores[0]+7, this.scores[0]-this.scores[1]+7])
        } else
        //continute
        {
          setTimeout(() => {
            this.socketService.ready(this.roomId)
          }, 1000);
        }

      }

    })

    this.socketService.enemyBat.subscribe((data: any) => {
      console.log(data["status"])
      if (data["status"] == "up") {
        //playerdata[2] isplayer1
        if (this.playerData["isplayer1"]) {
          this.BAT_Y[1] = Math.max(this.BAT_Y[1] - BAT_SPEED, 0)
        }
        else {
          this.BAT_Y[0] = Math.max(this.BAT_Y[0] - BAT_SPEED, 0)
        }
      };
      if (data["status"] == "down") {
        if (this.playerData["isplayer1"]) {
          this.BAT_Y[1] = Math.min(this.BAT_Y[1] + BAT_SPEED, 400)
        }
        else {
          this.BAT_Y[0] = Math.min(this.BAT_Y[0] + BAT_SPEED, 400)
        }
      }
    })

  }

  @HostListener('document:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {

    if (event.key == "ArrowUp" || "ArrowDown") {
      event.preventDefault();
      this.socketService.enemyUpdate(this.roomId, "stop")
    };

  }

  @HostListener('document:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {

    if (event.key == "ArrowUp") {
      event.preventDefault();
      //playerdata[2] isplayer1
      if (this.playerData["isplayer1"]) {
        this.BAT_Y[0] = Math.max(this.BAT_Y[0] - BAT_SPEED, 0)
      }
      else {
        this.BAT_Y[1] = Math.max(this.BAT_Y[1] - BAT_SPEED, 0)
      }
      this.socketService.enemyUpdate(this.roomId, "up")
    };
    if (event.key == "ArrowDown") {
      event.preventDefault();
      if (this.playerData["isplayer1"]) {
        this.BAT_Y[0] = Math.min(this.BAT_Y[0] + BAT_SPEED, 400)
      }
      else {
        this.BAT_Y[1] = Math.min(this.BAT_Y[1] + BAT_SPEED, 400)
      }
      this.socketService.enemyUpdate(this.roomId, "down")
    }
  }

  destroyRoom() {
    //disconnect from room
    this.socketService.destroyRoom(this.roomId);
    this.roomId = "";
    //return empty roomId to game component
    this.roomIdChange.emit(this.roomId)
  }

  setStartValues() {
    this.BAT_Y = [200, 200];
    this.BALL = [400, 250];
    this.BALL_SPEED = [-2, this.randomSpeed()];
  }

  drawCanvas() {
    //canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //p1
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(BAT_X[0], this.BAT_Y[0], BAT_WIDTH, BAT_HEIGHT);
    //p2
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(BAT_X[1], this.BAT_Y[1], BAT_WIDTH, BAT_HEIGHT);

    //midline
    this.ctx.beginPath();
    this.ctx.setLineDash([10]);
    this.ctx.moveTo(CANVAS_WIDTH / 2, 0);
    this.ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(
      this.BALL[0],
      this.BALL[1],
      BALL_RADIUS,
      2 * Math.PI,
      0,
      false
    );
    this.ctx.fillStyle = 'red';
    this.ctx.fill();

    //scores
    this.ctx.font = '32px Courier New bold'
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(this.scores[0].toString(), 370, 40, 50)
    this.ctx.fillText(this.scores[1].toString(), 410, 40, 50)

    this.canvasAni = window.requestAnimationFrame(() => this.drawCanvas());
  }

  moveBall() {
    this.BALL[0] = this.BALL[0] + this.BALL_SPEED[0]
    this.BALL[1] = this.BALL[1] + this.BALL_SPEED[1]

    //collisions
    //bat boundary, if bat present, X speed goes reverse
    if (this.batCollision()) {
      if (this.batPresent()) {
        this.BALL_SPEED[0] = -this.BALL_SPEED[0]
      }
      else {
        this.ready = false
        this.score()
      }
    }
    //wall collision, y speed goes reverse
    if (this.wallCollision()) {
      this.BALL_SPEED[1] = -this.BALL_SPEED[1]
    }
    if (this.ready)
      this.ballAni = window.requestAnimationFrame(() => this.moveBall());
  }

  wallCollision() {
    if (this.BALL[1] < 10 || this.BALL[1] > 490) {
      return true
    }
    return false
  }

  batCollision() {
    if (this.BALL[0] < 30 || this.BALL[0] > 760) {
      return true
    }
    return false
  }

  batPresent() {
    if (
      //on p1 side, and bat is there
      (this.BALL[1] > this.BAT_Y[0] && this.BALL[1] < this.BAT_Y[0] + BAT_HEIGHT && this.BALL[0] < 400)
      ||
      //on p2 side
      (this.BALL[1] > this.BAT_Y[1] && this.BALL[1] < this.BAT_Y[1] + BAT_HEIGHT && this.BALL[0] > 400))
      return true;
    return false
  }

  score() {
    if (this.BALL[0] < 400) {
      this.scores[1]++
    }
    else { this.scores[0]++ }

    this.socketService.score(this.roomId, this.scores);
    this.setStartValues();
  }

  randomSpeed() {
    var speed = (this.roomId.charCodeAt(1) * this.roomId.charCodeAt(2) + this.scores[1]) % 3 - (this.roomId.charCodeAt(3) * this.roomId.charCodeAt(4) - this.scores[0]) % 3
    if (speed == 0) {
      return Math.log2(this.roomId.charCodeAt(5) % 4) + 1
    }
    return speed
  }

}
