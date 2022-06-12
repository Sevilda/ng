import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DbService } from '../service/db.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  headers = [
    "socketid", "username", "login"
  ]
  dataSource: any;

  constructor(private dbservice: DbService) { 
    this.getUsers()
  }

  ngOnInit(): void {
  }

  getUsers() {
    this.dbservice.getUsers().subscribe(users => {
      this.dataSource = new MatTableDataSource(users); }, error => console.log(error))
  }

}
