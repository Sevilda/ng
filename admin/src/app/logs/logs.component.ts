import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DbService } from '../service/db.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  headers = [
    "id", "time", "entity_type", "entity_action", "entity_id"
  ]
  dataSource: any;

  constructor(private dbservice: DbService) {
    this.getLogs();
  }

  ngOnInit() {
  }

  getLogs() {
    this.dbservice.getLogs().subscribe(logs => {
      this.dataSource = new MatTableDataSource(logs); }, error => console.log(error))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
