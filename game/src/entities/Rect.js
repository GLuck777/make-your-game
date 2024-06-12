import {ConvertSizeCSSValueToInt} from "./System.js"

export class Rect{
    constructor(lengthX, lengthY){
        this.lengthX = lengthX;
        this.lengthY = lengthY
    }
    //Called for refreshing position and size 
    Set(x , y){
        let xInt = x;
        let yInt = y;
        let horizontalLength = -1;
        let verticalLength = -1;
        if (typeof(y) == String){
            yInt = ConvertSizeCSSValueToInt(y);
        }
        if (typeof(x) == String){
            xInt = ConvertSizeCSSValueToInt(x);
        }
        if (typeof(this.lengthX) == String){
            horizontalLength = ConvertSizeCSSValueToInt(this.lengthX);
        } else {
            horizontalLength = this.lengthX
        }
        if (typeof(this.lengthY) == String){
            verticalLength = ConvertSizeCSSValueToInt(this.lengthY);
        } else {
            verticalLength = this.lengthY;
        }
        return new Vector4(xInt, yInt, xInt+horizontalLength, yInt+verticalLength);
    }
}

// Called for representing rect value on the 2D World
class Vector4{
    constructor(x=0, y=0, w=0, h=0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    
    GetHorizontalSize(){
        return this.x + this.w;
    }

    GetVerticalSize(){
        return this.y+this.h;
    }
}