import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  headers = [
    "username", "score", "date"
  ]
  headerNames = {"username": "Username", "score": "Score", "date": "Date"}
  dataSource: any;


  ngOnInit(): void {
    this.getScores()  
  }

  getScores() {
    this.socketService.getScoreboard().subscribe(scores => {
      console.log(scores)
      this.dataSource = new MatTableDataSource(scores); }, error => console.log(error))
  }


}
