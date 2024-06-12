import { history, looseMsg } from "./Level.js";
import { set } from "./Set.js";
import {refreshData} from "../views/app.js"
let tuto = document.getElementById("tuto")
let displayFlou = document.getElementById("flou");
let displayInterface = document.getElementById("interface");
let titleInterface = document.getElementById("titleInterface");


let playBtn = document.getElementById("playBtn");
let continueBtn = document.getElementById("continueBtn");
let restartBtn = document.getElementById("restartBtn");
let scoreboardBtn = document.getElementById("scoreBtn");

let historyText = document.getElementById("history");

let divScoreboard = document.getElementById("div_scoreboard");
let saveScore = document.getElementById("form_score");

let keyboard = document.getElementById("div_keyboard");

export function SetInterfaceVisibility(status = "", currentLvl , txtKeyboardChange = "") {
    titleInterface.style.top = "2%";
    set.inMenu = true;
    switch (status) {
        case "main_menu":
            tuto.style.visibility = "visible";
            displayInterface.style.visibility = "visible";
            displayFlou.style.visibility = "visible";
            titleInterface.src = "/template/style/ressources/logo.png";
            titleInterface.style.height = "40%";
            titleInterface.style.visibility = "visible";
            divScoreboard.style.visibility = "hidden";
            playBtn.innerText = "Story";
            playBtn.style.visibility = "visible";
            continueBtn.innerText = "Endless";
            continueBtn.style.visibility = "visible";
            scoreboardBtn.innerText = "Score";
            scoreboardBtn.style.visibility = "visible";
            restartBtn.innerText = "Keys";
            restartBtn.style.visibility = "visible";
            keyboard.style.visibility = "hidden";
            historyText.style.visibility = "hidden";
            break;
        case "story":
            tuto.style.visibility = "hidden";
            divScoreboard.style.visibility = "hidden";
            displayInterface.style.visibility = "visible";
            titleInterface.style.height = "20%";
            titleInterface.style.visibility = "visible";
            titleInterface.src = "/template/style/ressources/Story.png";
            historyText.style.visibility = "visible";
            historyText.innerHTML = history[set.currentLvl];
            playBtn.style.visibility = "hidden";
            continueBtn.style.visibility = "visible";
            continueBtn.innerText = "Continue";
            scoreboardBtn.style.visibility = "hidden";
            (set.currentLvl == 0) ? restartBtn.innerText = "Return" : restartBtn.style.visibility = "hidden";

            break;
        case "endless_mode":
            tuto.style.visibility = "hidden";
            divScoreboard.style.visibility = "hidden";
            displayInterface.style.visibility = "visible";
            titleInterface.style.height = "20%";
            titleInterface.src = "/template/style/ressources/EM.png";
            titleInterface.style.visibility = "visible";
            historyText.style.visibility = "visible";
            historyText.innerHTML = "Endless mode is a challenging mode. " +
                "With only 10 lives and endless waves of intruders, test your skills and prove that you're the best! " +
                "Aim to reach the top of the scoreboard!";
            restartBtn.style.visibility = "visible";
            continueBtn.innerText = "Endless!";
            restartBtn.innerText = "Return";
            playBtn.style.visibility = "hidden";
            scoreboardBtn.style.visibility = "hidden";
            break;
        case "start_game":
            tuto.style.visibility = "hidden";
            historyText.style.visibility = "hidden";
            divScoreboard.style.visibility = "hidden";
            displayFlou.style.visibility = "hidden";
            playBtn.style.visibility = "hidden";
            scoreboardBtn.style.visibility = "hidden";
            displayInterface.style.visibility = "hidden";
            continueBtn.style.visibility = "hidden";
            titleInterface.style.visibility = "hidden";
            continueBtn.style.visibility = "hidden";
            continueBtn.innerText = "Continue";
            restartBtn.style.visibility = "hidden";
            set.inMenu = false;
            break;
        case "continue":
            displayFlou.style.visibility = "hidden";
            displayInterface.style.visibility = "hidden";
            historyText.style.visibility = "hidden";
            titleInterface.style.visibility = "hidden";
            restartBtn.style.visibility = "hidden";
            set.inMenu = false;
            break;
        case "scoreboard":
            playBtn.style.visibility = "visible";
            if (!set.isEndless) {
                set.modeJson = "story";
                refreshData();
                playBtn.innerText = "Endless Scoreboard";
                set.isEndless = true;
            } else {
                set.modeJson = "endless";
                refreshData();
                playBtn.innerText = "Story Scoreboard";
                set.isEndless = false;
            }
            tuto.style.visibility = "hidden";
            titleInterface.style.visibility = "visible";
            titleInterface.style.height = "20%";
            titleInterface.style.top = "1%";
            titleInterface.src = "/template/style/ressources/Scoreboard.png";
            divScoreboard.style.visibility = "visible";
            continueBtn.style.visibility = "visible";
            // (set.currentLvl > 2) ? continueBtn.innerText = "Restart" : continueBtn.innerText = "Main Menu";
            continueBtn.innerText = "Main Menu";
            if (scoreboardBtn.style.visibility === "hidden") { scoreboardBtn.style.visibility = "visible" };
            scoreboardBtn.innerText = "⬅";
            restartBtn.innerText = "➡";

            break;
        case "score":
            if (set.form.style.visibility === "visible") {
                set.form.style.visibility = "hidden";
            } else {
                titleInterface.style.top = "10%";
                titleInterface.style.visibility = "visible";
                titleInterface.style.height = "20%";
                if (set.currentLvl > 2) {
                    titleInterface.src = "/template/style/ressources/ConG.png";
                } else {

                    titleInterface.src = "/template/style/ressources/GO.png";
                }
                set.form.style.visibility = "visible"
            }
            break;
        case "keyboard":
            tuto.style.visibility = "hidden";
            titleInterface.style.height = "20%";
            titleInterface.src = "/template/style/ressources/KeyConf.png";
            historyText.style.visibility = "hidden";
            keyboard.style.visibility = "visible";
            playBtn.style.visibility = "hidden";
            continueBtn.innerText = "Main Menu";
            scoreboardBtn.style.visibility = "hidden";
            restartBtn.style.visibility = "hidden";
            break;
        case "change_keys":
            historyText.style.visibility = "visible";
            historyText.innerText = txtKeyboardChange;
            keyboard.style.visibility = "hidden";
            break;
        case "win":
            displayFlou.style.visibility = "visible";
            displayInterface.style.visibility = "visible";
            titleInterface.style.visibility = "hidden";
            scoreboardBtn.style.visibility = "visible";
            scoreboardBtn.innerText = "Continue";
            titleInterface.style.height = "20%";
            titleInterface.style.visibility = "visible";
            titleInterface.src = "/template/style/ressources/Story.png";
            historyText.style.visibility = "visible";
            historyText.innerHTML = history[set.currentLvl];
            break;
        case "lose":
            displayFlou.style.visibility = "visible";
            displayInterface.style.visibility = "visible";
            titleInterface.style.visibility = "hidden";
            scoreboardBtn.style.visibility = "visible";
            scoreboardBtn.innerText = "Continue";
            titleInterface.style.height = "20%";
            titleInterface.style.visibility = "visible";
            titleInterface.src = "/template/style/ressources/Story.png";
            historyText.style.visibility = "visible";
            historyText.innerHTML = looseMsg[set.currentLvl];
            break;
        case "pause":
            titleInterface.style.top = "20%";
            if (set.loopGame == 0) {
                displayFlou.style.visibility = "hidden";
                displayInterface.style.visibility = "hidden";
                titleInterface.style.visibility = "hidden";
                continueBtn.style.visibility = "hidden";
                scoreboardBtn.style.visibility = "hidden";
                restartBtn.style.visibility = "hidden";
            } else {
                displayFlou.style.visibility = "visible";
                displayInterface.style.visibility = "visible";
                titleInterface.style.height = "40%";
                titleInterface.style.visibility = "visible";
                titleInterface.src = "/template/style/ressources/Pause.png";
                continueBtn.style.visibility = "visible";
                continueBtn.innerText = "Main Menu";
                scoreboardBtn.style.visibility = "visible";
                scoreboardBtn.innerText = "Resume";
                restartBtn.style.visibility = "visible";
                restartBtn.innerText = "Restart";
            }
            break;
        case "congrats":
            displayFlou.style.visibility = "visible";
            displayInterface.style.visibility = "visible";
            titleInterface.style.height = "40%";
            titleInterface.style.visibility = "visible";
            historyText.style.visibility = "hidden";
            titleInterface.style.visibility = "hidden";
            scoreboardBtn.style.visibility = "hidden";
            saveScore.innerHTML = set.score + " pts";
            if (set.currentLvl > 2 && !set.isEndless) {
                titleInterface.src = "/template/style/ressources/ConG.png";
            } else {
                titleInterface.src = "/template/style/ressources/GO.png";
            }
            break;
        default:
            break;
    }
}