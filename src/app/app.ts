import { Component } from '@angular/core';
import { Home } from "./views/home/home";

@Component({
  selector: 'app-root',
  imports: [Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'not-asteroids';
}
