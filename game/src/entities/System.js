import { Vector2 } from "./Vector.js";

//Return the size of element (clear the  suffix like:'px' or '%') from sizeStr that is 'ypx' or 'y%'
export function ConvertSizeCSSValueToInt(sizeStr = ""){
    let sizeInt = 0;
    if (sizeStr.includes("px")){
        sizeInt = parseInt(sizeStr.replace("px", ""));
    } else if (sizeStr.includes("%")){
        sizeInt = parseInt(sizeStr.replace("%", ""));
    }
    return sizeInt;
}

// Called for getting an vector2 that contains  the position of the element in the HTML document
export function GetPosition(e = CSSStyleDeclaration){
    let horizontalPosValue = ConvertSizeCSSValueToInt(e.left);
    let verticalPosValue = ConvertSizeCSSValueToInt(e.top);
    return new Vector2(horizontalPosValue, verticalPosValue)
}

//Called for increasing (of weight) an number var when it's less than to 
export function lerpFloat(from, to, weight){
    if (from < to-weight){
        if (from > weight){
            return from + weight;
        } else {
            return from + 0.05;
        }
    } else if (from < to) {
        return from+weight;
    }
    return to
}

//Generate an id on the name's element
export function GetElementNameWithSuffix(name = String){
    let max = 100000;
    let result = Math.floor(Math.random()*max);
    return name + result.toString();
}

export function GetSize(e = CSSStyleDeclaration){
    let horizontalSize = ConvertSizeCSSValueToInt(e.width);
    let verticalSize = ConvertSizeCSSValueToInt(e.height);
    return new Vector2(horizontalSize, verticalSize);
}