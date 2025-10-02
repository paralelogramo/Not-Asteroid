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

    starList: string[] = ["bg-star-tiny", "bg-star-small", "bg-star-medium", "bg-star-large"];
    meteorList: string[] = ["bg-meteor-small", "bg-meteor-large", "bg-meteor-detailed-small", "bg-meteor-detailed-large", "bg-meteor-square-small", "bg-meteor-square-large", "bg-meteor-detailed-square-small", "bg-meteor-detailed-square-large"]

    ngOnInit(): void {
        this.initStars();
        this.initAsteroids();
        this.activateButtons();
    }

    initStars(): void {
        const container = document.getElementById('stars-container');
        if (!container) return;

        const starCount = 15;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const bgIndex = Math.floor(Math.random() * 4);
            const bgClass = this.starList[bgIndex];
            star.classList.add('absolute', 'w-6', 'h-6', 'bg-contain', 'bg-no-repeat', 'transition-opacity', 'duration-1000', bgClass);
            star.style.opacity = '0';
            container.appendChild(star);

            const animateStar = () => {
                const x = Math.random() * (window.innerWidth - 24);
                const y = Math.random() * (window.innerHeight - 24);

                star.style.left = `${x}px`;
                star.style.top = `${y}px`;
                star.style.opacity = '1';

                setTimeout(() => {
                    star.style.opacity = '0';
                }, 2500);
            };

            const initialDelay = Math.random() * 5000;
            setTimeout(() => {
                animateStar();
                setInterval(animateStar, 5000);
            }, initialDelay);
        }
    }

    initAsteroids(): void {
        const container = document.getElementById('stars-container');
        if (!container) return;

        const asteroidCount = 5;

        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = document.createElement('div');
            const bgIndex = Math.floor(Math.random() * 4);
            const bgClass = this.meteorList[bgIndex];
            asteroid.classList.add('absolute', 'w-16', 'h-16', 'bg-contain', 'bg-no-repeat', 'transition-opacity', 'duration-500', bgClass);
            asteroid.style.opacity = '0';
            asteroid.style.transformOrigin = 'center';
            container.appendChild(asteroid);

            const animateAsteroid = () => {
                const edge = Math.floor(Math.random() * 4);
                let x = 0, y = 0;
                let targetX = 0, targetY = 0;

                switch (edge) {
                    case 0:
                        x = Math.random() * (window.innerWidth - 48);
                        y = -50;
                        targetX = Math.random() * (window.innerWidth - 48);
                        targetY = window.innerHeight + 50;
                        break;
                    case 1:
                        x = window.innerWidth + 50;
                        y = Math.random() * (window.innerHeight - 48);
                        targetX = -50;
                        targetY = Math.random() * (window.innerHeight - 48);
                        break;
                    case 2:
                        x = Math.random() * (window.innerWidth - 48);
                        y = window.innerHeight + 50;
                        targetX = Math.random() * (window.innerWidth - 48);
                        targetY = -50;
                        break;
                    case 3:
                        x = -50;
                        y = Math.random() * (window.innerHeight - 48);
                        targetX = window.innerWidth + 50;
                        targetY = Math.random() * (window.innerHeight - 48);
                        break;
                }

                asteroid.style.left = `${x}px`;
                asteroid.style.top = `${y}px`;
                asteroid.style.opacity = '1';

                const duration = 10000 + Math.random() * 10000;

                let startTime: number | null = null;

                const move = (timestamp: number) => {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const progress = elapsed / duration;

                    const currentX = x + (targetX - x) * progress;
                    const currentY = y + (targetY - y) * progress;

                    const rotation = progress * 360;

                    asteroid.style.left = `${currentX}px`;
                    asteroid.style.top = `${currentY}px`;
                    asteroid.style.transform = `rotate(${rotation}deg)`;

                    if (progress < 1) {
                        requestAnimationFrame(move);
                    } else {
                        asteroid.style.opacity = '0';
                        setTimeout(animateAsteroid, 1000);
                    }
                };

                requestAnimationFrame(move);
            };

            const delayPerAsteroid = 5000; // 3 segundos de separación
            setTimeout(animateAsteroid, i * delayPerAsteroid);
        }
    }

    activateButtons(): void {
        setTimeout(() => {
            this.disabledButtons = false;
        }, 11000);
    }

    private animationHideView(): void {
        let base = document.getElementsByClassName("home-view")[0];
        base.classList.add("animation-delay-3")
        base.classList.add("fade-down")
    }

    clickCredits(): void {
        if (this.playAnimationOn) return;
        this.playAnimationOn = true;
        let btn = document.getElementById("play-btn");
        btn?.classList.add("is-button-active");
        setTimeout(() => {
            btn?.classList.remove("is-button-active");
            this.playAnimationOn = false;
            this.disabledButtons = true;
            this.selectedOption.emit("credits")
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
