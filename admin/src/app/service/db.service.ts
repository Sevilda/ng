import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService implements OnInit {

  logs:any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  getLogs(): Observable<any>
  {
    return this.http.get('http://localhost:3000/logs')
  }

  getUsers(): Observable<any>
  {
    return this.http.get('http://localhost:3000/users')
  }



}
