// src/app/services/game.service.ts
import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';

export interface ShipControls {
    up: boolean;
    left: boolean;
    right: boolean;
    down: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private app!: PIXI.Application;
    private engine!: Matter.Engine;
    private shipBody!: Matter.Body;
    private shipSprite!: PIXI.Sprite;
    private shipContainer!: PIXI.Container;
    private thrusterSprite!: PIXI.Sprite;
    private controls: ShipControls = {
        up: false,
        left: false,
        right: false,
        down: false
    };

    private shipSpeed = 0.003;
    private rotationSpeed = 0.05;

    async initializeGame(container: HTMLElement): Promise<void> {

        this.app = new PIXI.Application();

        await this.app.init({
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 0x0f172b,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            preference: "webgl"
        })

        container.appendChild(this.app.canvas);

        this.engine = Matter.Engine.create({
            gravity: { x: 0, y: 0 }
        });

        await this.createShip();
        this.setupControls();
        this.app.ticker.add(() => this.gameLoop());
    }

    private async createShip(): Promise<void> {
        const shipTexture = await PIXI.Assets.load('assets/ship_sidesC.png');
        const thrusterTexture = await PIXI.Assets.load('assets/effect_purple.png');

        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;

        this.shipContainer = new PIXI.Container();
        this.shipContainer.sortableChildren = true;
        this.shipContainer.x = centerX;
        this.shipContainer.y = centerY;

        this.thrusterSprite = new PIXI.Sprite(thrusterTexture);
        this.thrusterSprite.anchor.set(0.5, 0.5);
        this.thrusterSprite.scale.set(0.5);
        this.thrusterSprite.alpha = 0;
        this.thrusterSprite.x = 0;
        this.thrusterSprite.y = 35;

        this.shipSprite = new PIXI.Sprite(shipTexture);
        this.shipSprite.anchor.set(0.5);
        this.shipSprite.scale.set(0.5);
        this.shipSprite.x = 0;
        this.shipSprite.y = 0;

        this.shipContainer.addChild(this.thrusterSprite);
        this.shipContainer.addChild(this.shipSprite);

        this.shipContainer.setChildIndex(this.thrusterSprite, 0);
        this.shipContainer.setChildIndex(this.shipSprite, 1);

        this.app.stage.addChild(this.shipContainer);

        this.shipBody = Matter.Bodies.rectangle(
            centerX,
            centerY,
            this.shipSprite.width * 0.5,
            this.shipSprite.height * 0.5,
            {
                frictionAir: 0.1,
                inertia: Infinity,
                collisionFilter: {
                    group: -1
                },
                render: {
                    fillStyle: '#ff0000',
                    opacity: 0.5
                }
            }
        );

        Matter.World.add(this.engine.world, [this.shipBody]);
    }

    private setupControls(): void {
        window.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        window.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        switch (event.key.toLowerCase()) {
            case 'w':
                this.controls.up = true;
                break;
            case 'a':
                this.controls.left = true;
                break;
            case 's':
                this.controls.down = true;
                break;
            case 'd':
                this.controls.right = true;
                break;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        switch (event.key.toLowerCase()) {
            case 'w':
                this.controls.up = false;
                break;
            case 'a':
                this.controls.left = false;
                break;
            case 's':
                this.controls.down = false;
                break;
            case 'd':
                this.controls.right = false;
                break;
        }
    }

    private gameLoop(): void {
        Matter.Engine.update(this.engine, this.app.ticker.deltaMS);
        this.applyControls();
        this.updateThruster();

        this.shipContainer.x = this.shipBody.position.x;
        this.shipContainer.y = this.shipBody.position.y;
        this.shipContainer.rotation = this.shipBody.angle;
    }

    private updateThruster(): void {
        if (this.controls.up) {
            this.thrusterSprite.scale.set(0.5);
            this.thrusterSprite.alpha = 0.7 + Math.sin(Date.now() * 0.05) * 0.2;
        } else {
            this.thrusterSprite.alpha = Math.max(this.thrusterSprite.alpha - 0.08, 0);
        }
    }

    private applyControls(): void {
        const force = { x: 0, y: 0 };

        if (this.controls.left) {
            Matter.Body.rotate(this.shipBody, -this.rotationSpeed);
        }
        if (this.controls.right) {
            Matter.Body.rotate(this.shipBody, this.rotationSpeed);
        }

        if (this.controls.up || this.controls.down) {
            const direction = this.controls.up ? 1 : -1;
            const angle = this.shipBody.angle;

            force.x = Math.sin(angle) * this.shipSpeed * direction;
            force.y = -Math.cos(angle) * this.shipSpeed * direction;

            Matter.Body.applyForce(this.shipBody, this.shipBody.position, force);
        }
    }

    destroy(): void {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        window.removeEventListener('keyup', this.handleKeyUp.bind(this));

        if (this.app) {
            this.app.destroy();
        }

        if (this.engine) {
            Matter.Engine.clear(this.engine);
            Matter.World.clear(this.engine.world, false);
            Matter.Composite.clear(this.engine.world, false);
        }
    }
}