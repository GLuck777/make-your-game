
import { Vector2 } from "./Vector.js"
import { ExtraAppear} from "./Monster.js"

const speed = 40;

export class Monsters {
    constructor(gameCenter) {
        this.backupDirection = "";
        this.gameCenter = gameCenter;
        this.divElement = document.getElementById("monsters");
        this.position = new Vector2(0, 60);
        this.direction = "";
        this.SetDirection("right");
    }

    Move(x = null, y = null) {
        if (x == null && y == null) {
            if (this.direction == "down") {
                this.position.y += speed;
                switch (this.backupDirection) {
                    case "left":
                        ExtraAppear()
                        this.direction = "right";
                        break;
                    default:
                        ExtraAppear()
                        this.direction = "left";
                        break;
                }
            } else if (this.direction == "left") {
                this.position.x -= speed;
            } else if (this.direction == "right") {
                this.position.x += speed;
            }
            this.SetPosition();
        } else {
            this.position.y = y;
            this.position.x = x;
        }
    }

    SetDirection(newDirection) {
        switch (newDirection) {
            case "down":
                this.direction = "down";
                break;
            case "left":
                this.direction = "left";
                break;
            case "right":
                this.direction = "right";
                break;
        }

    }

    SetPosition() {
        this.divElement.style.left = this.position.x + "px";
        this.divElement.style.top = this.position.y + "px";
        this.collideWithWalls();
    }

    collideWithWalls() {
        //left move
        if (this.position.x - speed < 0 && this.direction == "left") {
            this.position.x = 0;
            this.divElement.style.left = this.position.x + "px";
            this.backupDirection = "left";
            this.direction = "down";
        }
        //right move
        if (this.divElement.offsetLeft + this.divElement.offsetWidth + speed > this.gameCenter && this.direction == "right") {
            this.position.x = this.gameCenter - this.divElement.offsetWidth;
            this.backupDirection = "right";
            this.direction = "down"
        }
    }


}