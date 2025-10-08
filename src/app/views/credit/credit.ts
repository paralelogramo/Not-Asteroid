import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

interface Technology {
    class: string;
    img: string;
    alt: string;
}

@Component({
    selector: 'app-credit',
    imports: [
        NgIcon,
        CommonModule
    ],
    templateUrl: './credit.html',
    styleUrl: './credit.css'
})
export class Credit {

    @Output() backHandler = new EventEmitter<string>();

    disabledButtons: boolean = true;
    playAnimationOn: boolean = false;

    technologies: Technology[] = [
        {
            class: "box-glow-angular",
            alt: "angular-logo.png",
            img: "/assets/logos/angular.png"
        },
        {
            class: "box-glow-matter",
            alt: "matter-js-logo.png",
            img: "/assets/logos/matter-js.png"
        },
        {
            class: "box-glow-pixi",
            alt: "pixi-js-logo.png",
            img: "/assets/logos/pixi-js.png"
        }
    ]

    ngOnInit(): void {
        this.activateButtons();
    }

    private animationHideView(): void {
        let base = document.getElementsByClassName("credit-view")[0];
        base.classList.add("fade-down")
    }

    clickBack(): void {
        if (this.playAnimationOn) return;
        this.playAnimationOn = true;
        let btn = document.getElementById("credit-btn");
        btn?.classList.add("is-button-active");
        setTimeout(() => {
            btn?.classList.remove("is-button-active");
            this.playAnimationOn = false;
            this.disabledButtons = true;
            this.backHandler.emit("back")
            this.animationHideView();
        }, 300);
    }

    activateButtons(): void {
        setTimeout(() => {
            this.disabledButtons = false;
        }, 9000);
    }

}
