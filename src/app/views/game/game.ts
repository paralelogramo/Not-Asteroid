import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { GameService } from './game.service';

@Component({
    selector: 'app-game',
    imports: [],
    templateUrl: './game.html',
    styleUrl: './game.css'
})
export class Game {
    @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef<HTMLDivElement>;

    constructor(private gameService: GameService) { }

    async ngAfterViewInit(): Promise<void> {
        await this.gameService.initializeGame(this.gameContainer.nativeElement);
    }

    ngOnDestroy(): void {
        this.gameService.destroy();
    }


}
