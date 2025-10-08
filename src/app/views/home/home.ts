import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgIcon } from "@ng-icons/core";

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        NgIcon
    ],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class Home {

    @Output() selectedOption = new EventEmitter<string>();

    disabledButtons: boolean = true;
    playAnimationOn: boolean = false;

    ngOnInit(): void {
        this.activateButtons();
    }

    activateButtons(): void {
        setTimeout(() => {
            this.disabledButtons = false;
        }, 5000);
    }

    private animationHideView(): void {
        let base = document.getElementsByClassName("home-view")[0];
        base.classList.add("fade-down")
    }

    clickCredits(): void {
        if (this.playAnimationOn) return;
        this.playAnimationOn = true;
        let btn = document.getElementById("credit-btn");
        btn?.classList.add("is-button-active");
        setTimeout(() => {
            btn?.classList.remove("is-button-active");
            this.playAnimationOn = false;
            this.disabledButtons = true;
            this.selectedOption.emit("credit")
            this.animationHideView();
        }, 300);
    }

    clickPlay(): void {
        if (this.playAnimationOn) return;
        this.playAnimationOn = true;
        let btn = document.getElementById("play-btn");
        btn?.classList.add("is-button-active");
        setTimeout(() => {
            btn?.classList.remove("is-button-active");
            this.playAnimationOn = false;
            this.disabledButtons = true;
            this.selectedOption.emit("play")
            this.animationHideView();
        }, 300);
    }

}
