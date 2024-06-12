import { Vector2 } from "./Vector.js";

export class Player {
    constructor(gameCenter) {
        this.Lives = 3;
        this.divElement = document.getElementById("player");
        this.name = "test";
        this.position = new Vector2();
        this.gameCenter = gameCenter;
    }

    // Called for spawning player object at an wanted position on the 2D world
    Spawn(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.position = new Vector2(x, y);
        if (this.divElement) { // Vérifie si img est défini
            this.divElement.style.left = this.position.x + "px";
            this.divElement.style.top = this.position.y + "px";
        }
    }

    //Called for setting position's object
    setPosition() {
        if (this.divElement) { // Vérifie si img est défini
            this.divElement.style.left = this.position.x + "px";
            this.divElement.style.top = this.position.y + "px";
        }
        this.collideWithWalls();
    }

    collideWithWalls() {
        //left move
        if (this.position.x < 0) {
            this.position.x = 0;
            this.divElement.style.left = this.position.x + "px";
        }
        //right move
        if (this.position.x > this.gameCenter - 70) {
            this.position.x = this.gameCenter - 70;
        }
    }

    HitByEnnemyBullet() {
        this.Lives -= 1;
        // console.log("Life still:", this.Lives);
    }
}
