import { Component } from '@angular/core';
import { Home } from "./views/home/home";

import { NgIcon, provideIcons } from '@ng-icons/core';
import { boxGithubLogo, boxInstagramLogo, boxLinkedinLogo } from '@ng-icons/boxicons/logos';

@Component({
  selector: 'app-root',
  imports: [
    Home,
    NgIcon
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    provideIcons({
      boxGithubLogo,
      boxLinkedinLogo,
      boxInstagramLogo
    })
  ]
})
export class App {
  protected title = 'not-asteroids';

  handleSelectedOption(event: any): void {
    if (event == "play") {
      setTimeout(() => {
        console.log("activar play")
      }, 7700);
    }
  }
}
