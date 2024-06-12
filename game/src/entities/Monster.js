import { set } from "./Set.js"
import { Vector2 } from "./Vector.js";
import { Sprite } from "./Sprite.js";
import { ConvertSizeCSSValueToInt, GetElementNameWithSuffix, GetSize } from "./System.js";
import { Rect } from "../entities/Rect.js";

let extraDiv = document.getElementById("extra");
extraDiv.style.left = document.getElementById("game").offsetWidth + "px";

export class Extra {
    constructor() {
        this.Lives = 1;
        this.Points = 7500;
    }
    SetPosition() {
        if (set.extraAppeared && !set.extraDisappeared) {
            let leftNbr = extraDiv.offsetLeft
            if (extraDiv.offsetLeft >= -40) {
                extraDiv.style.left = leftNbr - 2 + "px";
            } else {
                set.extraDisappeared = true;
                extraDiv.style.left = set.gameDivWidth + "px";
            }
        }
    }
    Colllide(bulletObj) {
        if (bulletObj.position.y > extraDiv.offsetTop + 25) return 
        let monsterPosition = {
            x: extraDiv.offsetLeft,
            y: extraDiv.offsetTop
        };
        // console.log("ma bullet actuelle: ", bulletObj, "position x: ", bulletObj.position.x, " \nposition y: ", bulletObj.position.y, 
        // "\n extraPosition x: ", monsterPosition.x, "extraPosition y: ", monsterPosition.y);

        let monsterSize = GetSize(extraDiv.style);
        let monsterRect = new Rect(monsterSize.x, monsterSize.y).Set(monsterPosition.x, monsterPosition.y);
        console.log("monsterRect\ntop: ", monsterRect.y, "\nleft: ", monsterRect.x, "\nbottom: ", monsterRect.h + extraDiv.offsetHeight, "\right: ", monsterRect.w + extraDiv.offsetWidth);
        
        
        if (bulletObj.position.x >= monsterRect.x && bulletObj.position.x <= monsterRect.w + extraDiv.offsetWidth) {
            if (bulletObj.position.y > monsterRect.y && bulletObj.position.y < monsterRect.h + extraDiv.offsetHeight) {
                console.log("<<<<<<< je rentre 1");
                bulletObj.Destroy();
                extraDiv.style.left = -40 + "px";
                set.score += this.Points;
                set.displayScore.innerHTML = "Score:" + set.score;
            } else {
                console.log(">>>> je ne rentre pas 2 ");
            }
        }
    }
}

export function ExtraAppear() {
    if (!set.extraAppeared) {
        const random = Math.random();
        if (random > 0.75) {
            set.extraAppeared = true;
        }
    }
}


export class Monster {
    constructor(color = String, x, y) {
        this.divElement = this.createDiv("monster" + x + "," + y);
        this.color = color;
        this.MonsterShow(color);
        this.animationFrameId = null;
        document.getElementById("monsters").appendChild(this.divElement);
        // console.log(this.divElement.id, this);
    }

    // setSkin(color =
    //     String) {
    //     if (["green", "yellow", "red"].includes(color)) {
    //         return url("../../../sprites/" + color + ".png");
    //     }
    //     return console.error("color '" + color + "' is invalid for skin.");
    // }

    Spawn(x, y, color) {
        this.position = new Vector2(x, y);
        this.divElement.style.position = "absolute";
        this.divElement.style.visibility = "visible";
        this.divElement.style.top = this.position.y + "px";
        this.divElement.style.left = this.position.x + "px";
        this.Alive = true;
        switch (color) {
            case "yellow":
                this.Lives = 1;
                this.Points = 1000;
                break;
            case "green":
                this.Lives = 2;
                this.Points = 1750;
                break;
            case "red":
                this.Lives = 3;
                this.Points = 2750;
                break;
            default:
                this.Lives = 1;
                this.Points = 7500;
                break;
        }
    }
    SetPosition() {
        this.divElement.style.left = this.position.x + "px";
        this.divElement.style.top = this.position.y + "px";
    }

    MonsterShow(color) {
        this.Sprite = new Sprite();
        this.Sprite.initialize(color).then(() => {
            this.Sprite.SpriteShow(this.divElement);

        }).catch(error => {
            console.error("Sprite texture wasn't able to load:", error);
        });
    }

    GetGlobalPosition() {
        let parentElement = document.getElementById("monsters");
        let parentDivStyle = getComputedStyle(parentElement);
        let parentDivPosition = new Vector2(ConvertSizeCSSValueToInt(parentDivStyle.left), ConvertSizeCSSValueToInt(parentDivStyle.top))
        return new Vector2(parentDivPosition.x + this.position.x, parentDivPosition.y + this.position.y)
    }

    createDiv(divName = "") {
        let divElement = document.createElement("div");
        divElement.className = "monster";
        divElement.id = divName;
        return divElement;
    }

    Destroy() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null;
        }

    }
    collideWithWalls() {
        //left move
        if (this.position.x < 0) {
            this.position.x = 0;
            this.img.style.left = this.position.x + "px";
        }

        //right move
        if (this.position.x > this.gameCenter - 70) {
            this.position.x = this.gameCenter - 70;
        }
    }

    // Hide monster when it's dead
    Hide() {
        this.Alive = false;
        this.divElement.style.visibility = "hidden";
    }

    // Decrease monster hp when hitted
    HitByBullet() {
        if (this.Lives > 1) {
            this.Lives--;
        } else {
            this.Lives--;
            this.Hide();
        }
    }
    Test() {
        // console.log("je rentre dans test()")
        if (this.divParent != null) {
            this.divParent.removeChild(this.divElement);
        }
    }
}