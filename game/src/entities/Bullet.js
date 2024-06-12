import { Rect } from "./Rect.js";
import { Vector2 } from "./Vector.js";
import { Sprite } from "./Sprite.js";
import { lerpFloat } from "./System.js";

export class Bullet{
    constructor(viewportRect = Rect, shooter = "", div = HTMLElement, index = 0){
        this.divElement = div
        this.ViewportRect = viewportRect;
        this.Gravity = 1;
        this.Shooter = shooter;
        this.Sprite = new Sprite();
        this.IsFired = false;
        this.Box = index * 2;
        if (shooter == "player"){
            this.speed = 0.00;
            this.MAXIMUM_SPEED = 5;
        } else{
            this.speed = 1.00;
            this.MAXIMUM_SPEED = 10;
        }
    }

    SetSpeedByEnemyType(color){
        switch (color) {
            case "yellow":
                this.MAXIMUM_SPEED = 5;
                break;
            case "blue":
                this.MAXIMUM_SPEED = 7;
                break;
            case "red":
                this.MAXIMUM_SPEED = 10;
            default:
                break;
        }
    }

    Move(){
        if (this.IsFired){
            this.speed = lerpFloat(this.speed, this.MAXIMUM_SPEED, 0.20);
            if (this.Shooter == "player"){
                this.position.y -= this.speed;
            } else {
                this.position.y += this.speed;
            }
            this.setPosition();
        }
    }

    BulletShow(){
        this.Sprite = new Sprite("bullet"); //should be bullet
        this.Sprite.initialize("bullet").then(() => {
            this.Sprite.SpriteShow(this.divElement);
        }).catch(error => {
            console.error("Error initializing the sprite:", error);
        });
    }

    //Called for spawning bullet object on the 2D world  at a given position
    Spawn(x, y, shooter = ""){
        this.Shooter = shooter;
        this.position = new Vector2(x, y);
        this.setPosition();
        this.speed = 0.00;
    }

    // Runtime for setting position during the gameplay
    setPosition() {
        if (this.IsFired){
            if(this.divElement) { // Vérifie si img est défini
                this.divElement.style.left = this.position.x + "px";
                this.divElement.style.top = this.position.y + "px";
            }
        }
    }

    CanBeDestroyed(playerPosY){
        if (this.position.y < this.ViewportRect.y || this.position.y > playerPosY){
            this.Destroy();
            return true;
        }
        return false;
    }

    Destroy(){
        this.IsFired = false;
        if(this.Shooter == "player"){
            this.divElement.style.left = 71+this.Box+ "%";
            this.divElement.style.top = "95%";
        } else {
            this.divElement.style.left = 0+ "px";
            this.divElement.style.top = -50+"px";
        }
    }
}