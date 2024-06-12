import { Vector2 } from "./Vector.js";

export class Sprite {
    constructor() {
        this.Scale = null;
        this.img = new Image(); // Utilisez 'this.img' avec un 'i' minuscule
    }

    async initialize(imageName){
        try {
            await this.loadImage(imageName);
            this.setSize();
        } catch (error) {
            console.log("Failed to load image:", error);
        }
    }

    loadImage(imageName){
        return new Promise((resolve, reject) => {
            this.img.onload = () => {
                resolve(new Vector2(this.img.width, this.img.height));
            };
            this.img.onerror = () => {
                console.error("Failed to load image :",imageName);
                reject(new Error("Failed to load image"));
            };
            this.img.src = "../../../template/style/ressources/" + imageName + ".png";
        });
    }
    
    setSize(){
        this.Scale = new Vector2(this.img.width, this.img.height);
    }

    SpriteShow(htmlElement) {
        if (htmlElement instanceof HTMLElement) {
            if (this.Scale) {
                htmlElement.style.backgroundImage = `url('${this.img.src}')`;
                htmlElement.style.width = `${this.Scale.x}px`;
                htmlElement.style.height = `${this.Scale.y}px`;    
            } else {
                console.log("The vector object isn't ready ('this.Scale'):", this.Scale)
            }
        } else {
            console.error("The provided element is not a valid HTMLElement.");
        }
    }
}
