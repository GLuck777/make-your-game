import { keyboardConfig } from "../views/app.js";
import { SetInterfaceVisibility } from "./InterfaceVisibility.js";

//Return action of btn id
export function GetAction(btnElementInnerText){
    return btnElementInnerText.replace("btn_", "");
}
//Called for update keys when user pressed an another one 
export function UpdateKeys(newKey, idElement) {
    switch (idElement) {
        case "btn_shoot":
            keyboardConfig.shoot = newKey;
            break;
        case "btn_pause":
            keyboardConfig.pause = newKey;
            break;
        case "btn_right":
            keyboardConfig.right = newKey;
            break;
        case "btn_left":
            keyboardConfig.left = newKey;
            break;
    }
}
//called for show keys on the keyboard table when user load keyboard table
export function LoadKeys() {
    let keys = Object.keys(keyboardConfig);
    let keyboardTable = document.querySelectorAll("#div_keyboard tr button");
    let indexKeys = 0;
    let vs = Object.values(keyboardConfig);
    keyboardTable.forEach((element) => {
        element.innerText = ConformKeyName(vs[indexKeys]);
        SetInterfaceVisibility("change_keys");
        indexKeys++;
    });
}

//Convert " " into "Space"
export function CorrectSpaceKeys(key){
    let e = key;
    if (e == " "){
        e = "Space"
    }
    return e
}

//Get the action associated to the given key
export function GetActionFromKey(key = "", keyboardConfig){
    let values = Object.values(keyboardConfig);
    let keys = Object.keys(keyboardConfig);
    let index = 0;
    let k = "";
    values.forEach((event) => {
        if (event == key){
            key = keys[index];
        }
        index++;
    })
    return key;
}

// Return the actual key from the given action
export function GetKeyFromAction(action = "", keyboardConfig){
    let values = Object.values(keyboardConfig);
    let actions = Object.keys(keyboardConfig);
    let index = 0;
    let key = "";
    actions.forEach((k) => {
        if (k == action){
            key = values[index];
        };
        index++;
    });
    return key;
}

//Called for removing some prefixes
function ConformKeyName(s = String) {
    let result = "";
    if (s === ' '){
        return "Space";
    }
    if (s.includes("Key")) {
        result = s.replace("Key", "");
    } else if (s.startsWith("Arrow")) {
        result = s.replace("Arrow", "Arrow ")
    }
    if (result == "") {
        return s;
    }
    return result;
}