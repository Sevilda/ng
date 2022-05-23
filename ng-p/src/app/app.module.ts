import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {MatTabsModule} from  '@angular/material/tabs';
import { SocketService } from './socket.service';
import { PongGameComponent } from './game/pong-game/pong-game.component';

const config: SocketIoConfig = { url: 'http://localhost:4200', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ChatComponent,
    ScoreboardComponent,
    PongGameComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    AppRoutingModule, 
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    MatProgressSpinnerModule
  ],
  providers: [SocketService],

  bootstrap: [AppComponent]
})
export class AppModule { }
