import {Rect} from "./Rect.js";

export class VisualViewport{
    constructor(x,y, width, height){
        this.rect = new Rect();
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
    }
}