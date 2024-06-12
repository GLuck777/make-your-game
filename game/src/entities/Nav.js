import { set, dickSounds } from "./Set.js";
import { updateGame, PauseGame, loadScoreboard, refreshData } from "../views/app.js";

import { level, infiniteLevel, generateMapMonster, ClearLevel } from "./Level.js";
import { SetInterfaceVisibility } from "../entities/InterfaceVisibility.js";
import { Monsters } from "./Monsters.js";
import { Monster } from "./Monster.js";
import { Vector2 } from "./Vector.js";
import { GetTimeLeft, timerStart } from "../entities/Timer.js";
let playBtn = document.getElementById("playBtn");
let continueBtn = document.getElementById("continueBtn");
let restartBtn = document.getElementById("restartBtn");
let scoreboardBtn = document.getElementById("scoreBtn");

let resetPosition;
export let monster;
function loadMonsters(map) {
    ResetMonstersSize()
    set.extraAppeared = false;
    set.extraDisappeared = false;
    document.getElementById("monsters").innerHTML = '';
    set.monstersObj = [];
    let monstersArray = [];
    set.remainingEnemies = 0;
    monster = null;
    for (let y = 0; y <= Object.keys(map).length - 1; y++) {
        for (let x = 0; x <= map[y].length - 1; x++) {
            set.remainingEnemies++;
            monster = new Monster(map[y][x], x, y);
            monster.Spawn(x * 45, y * 37, map[y][x]);
            monstersArray.push(monster);
        }
    }
    monstersArray.forEach((monster) => {
        set.monstersObj.push(monster);
    })
    set.visibleMonsters = [];
    set.visibleMonsters = set.monstersObj;
}
function ResetMonstersSize() {
    let tab = level[set.currentLvl]
    if (set.isEndless) {
        console.log(set.currentLvl);
        tab = infiniteLevel[set.currentLvl];
    }
    

    let MonstersWidth = -1;
    for (let y = 0; y <= Object.keys(tab).length - 1; y++) {
        if (tab[y].length > MonstersWidth) {
            MonstersWidth = tab[y].length;
        }
    }
    set.divParentMonsters.style.height = (Object.keys(tab).length * 37) + "px";
    MonstersWidth = (MonstersWidth * 45) - 5;
    set.divParentMonsters.style.width = (MonstersWidth + 4) + "px";
}
function LevelSelect() {
    bonusChain.style.visibility = "hidden";
    set.chainMult.style.visibility = "hidden";
    chainMonsterDiv.style.visibility = "hidden";
    set.chain = 0;
    set.chainP.innerHTML = "";
    set.lastEnnemyDestroyed = "";
    switch (set.currentLvl) {
        case 0:
            set.gameDiv.style.backgroundImage = "url(/template/style/ressources/b.png)"
            break;
        case 1:
            set.gameDiv.style.backgroundImage = "url(/template/style/ressources/desktop-wallpaper-8-bit-64-bit.jpg)"
            break;
        default:
            set.gameDiv.style.backgroundImage = "url(/template/style/ressources/ec9ec719f7ee771a7a63a1968a892572.jpeg)"
            break;
    }
    set.player.Lives = 3;
    DestroyAllBullets();
    set.monsterParent.Move(0, 120);
    set.monsterParent.direction = "right"; // a tester pour toujours commencer avec la direction droite pour la div Monsters

    set.player.position.x = set.posPlayerX;
    set.player.position.y = set.posPlayerY;
    set.player.setPosition();

    loadMonsters(level[set.currentLvl]);
}
export function EndlessSelect() {
    set.gameDiv.style.backgroundImage = "url(/template/style/ressources/desktop-wallpaper-8-bit-64-bit.jpg)";
    generateMapMonster()
    ResetMonstersSize();
    loadMonsters(infiniteLevel[set.currentLvl]);
    set.monsterParent.direction = "right";
    set.monsterParent.Move(0, 120);
    set.monsterParent.SetPosition();
}
export function DestroyAllBullets() {
    set.bulletsObj.forEach((bullet) => {
        if (bullet.IsFired) {
            bullet.Destroy();
        }
    })
    set.bulletsMonsterObj.forEach((bullet) => {
        if (bullet.IsFired) {
            bullet.Destroy();
        }
    })
}
// Commencer la mise à jour du jeu
export function game() {
    document.addEventListener('DOMContentLoaded', () => {
        generateMapMonster()
        set.player.Spawn(set.posPlayerX, set.posPlayerY);
        SetInterfaceVisibility("main_menu");
        // set.monsterParent = new Monsters(set.gameDivWidth);
        set.monsterParent.SetPosition();
        resetPosition = new Vector2(set.monsterParent.position.x, set.monsterParent.position.y);
        //Btn #1
        playBtn.addEventListener("click", function () {
            switch (playBtn.innerText) {
                case "Story":
                    timerStart("reset");
                    LevelSelect();
                    set.monsterParent.SetPosition();
                    set.isEndless = false;
                    bonusChain.style.visibility = "hidden";
                    set.chainMult.style.visibility = "hidden";
                    chainMonsterDiv.style.visibility = "hidden";
                    set.chain = 0;
                    set.chainP.innerHTML = "";
                    set.lastEnnemyDestroyed = "";
                    set.livesCountDisplay.innerHTML = " x " + set.player.Lives;
                    set.score = 0;
                    set.displayScore.innerHTML = "Score:" + set.score;
                    SetInterfaceVisibility("story", set.currentLvl);
                    break;
                case "Story Scoreboard":
                    playBtn.innerText = "Endless Scoreboard";
                    SetInterfaceVisibility("scoreboard", set.currentLvl);
                    refreshData()
                    break;
                case "Endless Scoreboard":
                    playBtn.innerText = "Story Scoreboard";
                    SetInterfaceVisibility("scoreboard", set.currentLvl);
                    break;
                case "Score":
                    SetInterfaceVisibility("scoreboard", set.currentLvl);
                    break;
                default: //scoreboard
                    playBtn.style.visibility = "visible";
                    break;
            }
        })
    });
}
//Btn #2 Continue
continueBtn.addEventListener("click", function () {
    switch (continueBtn.innerText) {
        case "Main Menu":
            set.isEndless = false;
            DestroyAllBullets();
            ClearLevel(); // reset la map aléatoire
            cancelAnimationFrame(set.loopGame);
            set.loopGame = 0;
            SetInterfaceVisibility("main_menu");
            set.currentLvl = 0;
            document.getElementById("formBtn").disabled = false;
            break;
        case "Endless":
            ClearLevel();
            set.player.Lives = 10;
            timerStart("reset");
            //Generate a map for infiniteLevel
            // generateMapMonster()
            EndlessSelect();
            set.livesCountDisplay.innerHTML = " x " + set.player.Lives;
            set.score = 0;
            set.displayScore.innerHTML = "Score:" + set.score;
            SetInterfaceVisibility("endless_mode");
            break;
        case "Endless!":
            //Start le jeu en mode Endless + setInterface pour enlever l'interface
            // alert("Le Endless Mode sera intégré dans une prochaine maj")
            //continue qui débute le jeu en mode Story
            bonusChain.style.visibility = "hidden";
            set.chainMult.style.visibility = "hidden";
            chainMonsterDiv.style.visibility = "hidden";
            set.chain = 0;
            set.chainP.innerHTML = "";
            set.lastEnnemyDestroyed = "";
            set.isEndless = true;
            if (dickSounds.music != null) {
                set.currentPlaybackTime = 0;
                dickSounds.music.currentTime = set.currentPlaybackTime;
                dickSounds.music.play();
            }
            set.isGameOver = false; // test
            set.isWin = false; // test
            updateGame();
            SetInterfaceVisibility("start_game");
            break;
        case "Continue":
            //continue qui débute le jeu en mode Story
            set.isEndless = false;
            if (dickSounds.music != null) {
                set.currentPlaybackTime = 0;
                dickSounds.music.currentTime = set.currentPlaybackTime;
                dickSounds.music.play();
            }
            set.isGameOver = false; // test
            set.isWin = false; // test
            updateGame();
            SetInterfaceVisibility("start_game");
            break;
        case "Restart":
            window.location.reload(true);
            break;
        default:
            updateGame();
            break;
    }
})
//Btn #3 Score
scoreboardBtn.addEventListener("click", function () {
    switch (scoreboardBtn.innerText) {
        case "Score":
            SetInterfaceVisibility("scoreboard", set.currentLvl);
            break;
        case "Continue":
            //continue présent à chaque victoire
            if (set.currentLvl > 2 && set.isGameOver && set.isWin && !set.isEndless) {
                SetInterfaceVisibility("congrats", set.currentLvl);
                SetInterfaceVisibility("score", set.currentLvl);
            } else if (set.isGameOver && !set.isWin) {
                SetInterfaceVisibility("congrats", set.currentLvl);
                SetInterfaceVisibility("score", set.currentLvl);
            } else {
                set.player.Lives = 3;
                set.livesCountDisplay.innerHTML = " x " + set.player.Lives;
                set.form.style.visibility = "hidden";
                SetInterfaceVisibility("continue");
                set.isGameOver = false;
                set.isWin = false;
                set.remainingEnemies = 0
                if (set.currentLvl <= 2) {
                    LevelSelect()
                    if (set.currentLvl > 2) { SetInterfaceVisibility("score", set.currentLvl) }
                }
                scoreboardBtn.style.visibility = "hidden";
            }
            break;
        case "Resume":
            if (!set.inMenu) {
                PauseGame();
            }
            break;
        case "⬅":
            loadScoreboard(0, 9);
            break;
    }
});
//Btn #4 Restart
restartBtn.addEventListener('click', function () {
    switch (restartBtn.innerText) {
        case "Restart":
            if (set.isEndless) {
                ClearLevel(); // reset la map aléatoire
                DestroyAllBullets();
                set.currentLvl = 0;
                EndlessSelect();
                set.player.Lives = 10;
                timerStart("reset");
                set.livesCountDisplay.innerHTML = " x " + set.player.Lives;
                set.score = 0;
                set.displayScore.innerHTML = "Score:" + set.score;
                SetInterfaceVisibility("endless_mode");
            } else {
                set.currentLvl = 0;
                LevelSelect();
                timerStart("reset");
                set.livesCountDisplay.innerHTML = " x " + set.player.Lives;
                set.score = 0;
                set.displayScore.innerHTML = "Score:" + set.score;
                bonusChain.style.visibility = "hidden";
                set.chainMult.style.visibility = "hidden";
                chainMonsterDiv.style.visibility = "hidden";
                set.chain = 0;
                set.chainP.innerHTML = "";
                set.lastEnnemyDestroyed = "";
                SetInterfaceVisibility("story", set.currentLvl);
            }
            break;
        case "Keys":
            SetInterfaceVisibility("keyboard");
            break;
        case "➡":
            // continueBtn.innerText = "⬅";
            loadScoreboard(10, 19);
            break;
        case "Return":
            SetInterfaceVisibility("main_menu");
            break
    }
})