import { Player } from "../entities/Player.js";
import { set, dickSounds } from "../entities/Set.js";
import { Bullet } from "../entities/Bullet.js";
import { Rect } from "../entities/Rect.js";
import { Vector2 } from "../entities/Vector.js";
import { Monster } from "../entities/Monster.js";

import { GetTimeLeft, timerStart } from "../entities/Timer.js";
import { level, infiniteLevel, generateMapMonster } from "../entities/Level.js";

import { CorrectSpaceKeys, GetActionFromKey, GetKeyFromAction, UpdateKeys, LoadKeys, GetAction } from "../entities/Keyboard.js";
import { SetInterfaceVisibility } from "../entities/InterfaceVisibility.js";
import { game } from "../entities/Nav.js";
import { DestroyAllBullets, monster, EndlessSelect } from "../entities/Nav.js";
import { MonsterRuntime, BulletRuntime, Shoot } from "../entities/Runtime.js";

let playerName = document.getElementById("form_username");
let formBtn = document.getElementById("formBtn")
let tabBodyScore = document.getElementById("tab_body_score");
set.chainP.innerHTML = "";
// set.bonusScore.innerText = "";
let lastUpdateTime = performance.now();
let chronoPlayerShoot = 0;


export let keyboardConfig = {
    right: "ArrowRight",
    left: "ArrowLeft",
    shoot: "Space",
    pause: "ArrowUp"
}

let keysPressed = {};

let bodyStyle = getComputedStyle(document.body);
let viewport = new Rect(bodyStyle.width, bodyStyle.height).Set(0, 0);

//ScoreBoard
let datas;
let loadData = (data) => {
    datas = data
    loadScoreboard(0, 9);
};

export function loadScoreboard(minimum = Number, maximum = Number) {
    // Clear the existing scoreboard data before appending new data
    tabBodyScore.innerHTML = "";
    for (let i = minimum; i <= maximum; i++) {
        let tabInfos = document.createElement("tr");

        let tabId = document.createElement("td");
        tabId.classList.add("tabLine");
        tabId.innerHTML = i + 1 + ".";

        let tabName = document.createElement("td");
        let tabTime = document.createElement("td");
        let tabScore = document.createElement("td");

        tabName.classList.add("tabLine");
        tabTime.classList.add("tabLine");
        tabScore.classList.add("tabLine");

        if (datas[i] == undefined) {
            tabName.innerHTML = "-";
            tabTime.innerHTML = "--:--";
            tabScore.innerHTML = "-";
        } else {
            tabName.innerHTML = datas[i]['name'];
            tabTime.innerHTML = datas[i]["time"];
            tabScore.innerHTML = datas[i]["score"];
        }
        switch (i) {
            case 0:
                tabInfos.style.color = "#d0c050";
                tabInfos.style.backgroundColor = "#aa1717";
                tabInfos.style.fontSize = "x-large";
                break;
            case 1:
                tabInfos.style.color = "#50d070";
                tabInfos.style.backgroundColor = "#dd621e";
                tabInfos.style.fontSize = "x-large";
                break;
            case 2:
                tabInfos.style.color = "#f14f50";
                tabInfos.style.backgroundColor = "#ffd81d";
                tabInfos.style.fontSize = "x-large";
                break;
            default:
                break;
        }
        tabInfos.appendChild(tabId);
        tabInfos.appendChild(tabName);
        tabInfos.appendChild(tabTime);
        tabInfos.appendChild(tabScore);
        tabBodyScore.appendChild(tabInfos);

    }
}
//formulaire
formBtn.addEventListener("click", function () {
    if (playerName.value === "") {
        // Afficher une alerte si le pseudo est vide
        alert("Veuillez entrer un pseudo pour vous enregistrer.");
        return;
    } else {
        const url = '/api';
        // const url = 'http://localhost:8080/api';
        document.getElementById("formBtn").disabled = true;
        playerName.innerHTML = '';
        set.form.style.visibility = "hidden"; // check
        restartBtn.style.visibility = "visible";
        SetInterfaceVisibility("scoreboard", set.currentLvl);

        // Créer un objet avec les données à envoyer

        const data = {
            mode: set.modeJson,
            score: set.score.toString(),
            time: GetTimeLeft(),
            name: playerName.value,
        };


        // Configurer la requête POST
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }
                return response.text(); // Utiliser text() pour obtenir le corps de la réponse en tant que texte
            })
            .then(text => {
                try {
                    const responseData = text ? JSON.parse(text) : {};
                    refreshData();
                } catch (e) {
                    console.error('Erreur lors de la conversion de la réponse en JSON:', e);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la requête fetch:', error.message);
            });
    }
});

export function refreshData() {
    if (set.modeJson == "story" || set.modeJson == "") {
        fetch("/StoryJSON")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Retournez ici pour passer au prochain .then
            })
            .then(loadData)
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    } else {
        fetch("/EndlessJSON")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Retournez ici pour passer au prochain .then
            })
            .then(loadData)
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
}

// Initial load of data
refreshData();

document.addEventListener('keydown', (event) => {
    // keysPressed[event.code] = true;
    let e = CorrectSpaceKeys(event.key)
    keysPressed[e] = true;
});

document.addEventListener('keyup', (event) => {
    // delete keysPressed[event.code];
    let e = CorrectSpaceKeys(event.key)
    delete keysPressed[e];
});



export function updateGame(timestamp) {
    checkGameOver();
    set.extraVar.SetPosition();
    let elapsedTime = timestamp - lastUpdateTime;
    if (!set.isGameOver) {
        if (keysPressed[keyboardConfig.right]) {
            set.player.position.x += 10
            set.player.setPosition();
        } else if (keysPressed[keyboardConfig.left]) {
            set.player.position.x -= 10;
            set.player.setPosition();
        }
        if (keysPressed[keyboardConfig.shoot]) {
            if (chronoPlayerShoot == 0) {
                chronoPlayerShoot = set.MAXIMUM_PLAYER_SHOOT;
                Shoot("player");
            }
        }
        if (chronoPlayerShoot != 0) {
            chronoPlayerShoot -= (chronoPlayerShoot > 0);
        }
        if (elapsedTime >= 1000) {
            lastUpdateTime = timestamp;
            timerStart();
            if (set.monsterParent) {
                set.monsterParent.Move();
            }
        }
        BulletRuntime();
        MonsterRuntime();
    }
    set.loopGame = requestAnimationFrame(updateGame);
}


//Check if the gameplay still run or not
function checkGameOver() {
    if (set.isGameOver) {
        return;
    }
    if (set.player.Lives == 0 && !set.isGameOver) {
        if (set.isEndless) {
            DestroyAllBullets();
            set.isGameOver = true;
            SetInterfaceVisibility("congrats", set.currentLvl);
            SetInterfaceVisibility("score", set.currentLvl);
        } else {
            DestroyAllBullets();
            SetInterfaceVisibility("lose", set.currentLvl);
            set.isGameOver = true;
        }
    }
    if (set.remainingEnemies == null) {
        if (set.isEndless) {
            set.currentLvl++;

            EndlessSelect()
        } else {
            DestroyAllBullets();
            set.isWin = true;
            set.isGameOver = true;
            cancelAnimationFrame(set.loopGame);
            set.loopGame = 0;
            set.currentLvl++;
            SetInterfaceVisibility("win", set.currentLvl);
        }
    }

    if (set.divParentMonsters.querySelectorAll(".monster").length > 1) {
        if (set.divParentMonsters.offsetTop + set.divParentMonsters.offsetHeight > set.player.position.y) {
            DestroyAllBullets();
            set.isGameOver = true;
            SetInterfaceVisibility("lose", set.currentLvl);
        }
    }
}

export function PauseGame() {
    SetInterfaceVisibility("pause");
    set.inMenu = false;
    if (set.loopGame == 0) { // Animation stoppée : on la relance
        // displayTextPause.style.visibility = "hidden";
        if (dickSounds.music != null) {
            dickSounds.music.currentTime = set.currentPlaybackTime;
            dickSounds.music.play();
        }
        updateGame();
    } else {  // Arrêt de l'animation
        cancelAnimationFrame(set.loopGame);
        set.loopGame = 0;
        if (dickSounds.music != null) {
            set.currentPlaybackTime = dickSounds.music.currentTime;
            dickSounds.music.pause();
        }

        // displayTextPause.style.visibility = "visible";
    }
}

function loadTools() {
    // if (!timer){
    let timer = document.createElement("div");
    timer.id = "time";
    timer.innerHTML = "00:00";
    set.gameDiv.appendChild(timer);
    // }

    set.livesCountDisplay.innerHTML = " x " + set.player.Lives;

    document.getElementById("bot").appendChild(set.livesDiv);
    set.livesDiv.appendChild(set.livesImgDisplay);
    set.livesDiv.appendChild(set.livesCountDisplay);

    set.displayScore.id = "score";
    set.displayScore.innerHTML = "Score:" + set.score;
    set.gameDiv.appendChild(set.displayScore);

    set.chainP.id = "chainNb";
    set.chainMult.appendChild(set.chainP);
}
//Called for loading bullets in game
function loadBullets() {
    let indexBullet = 0;
    document.querySelectorAll(".playerBullet").forEach((divElem) => {
        let bullet = new Bullet(viewport, "player", divElem, indexBullet);
        divElem.style.position = "absolute";
        set.bulletsObj.push(bullet)
        indexBullet++;
    });
    document.querySelectorAll(".monsterBullet").forEach((divElem) => {
        let bullet = new Bullet(viewport, "monster", divElem);
        divElem.style.position = "absolute";
        set.bulletsMonsterObj.push(bullet)
    });
}



let btnKeys = document.querySelectorAll(".btn_keys")
let idElement;
btnKeys.forEach((button) => {
    button.addEventListener("click", function () {
        SetInterfaceVisibility("change_keys", set.currentLvl, GetAction(button.id));
        let idElement = button.id;
        let keyPressPromise = new Promise((resolve, reject) => {
            let keydownListener = function (event) {
                document.removeEventListener("keydown", keydownListener);
                resolve(event.key); // Use event.key instead of event.code
            };
            document.addEventListener("keydown", keydownListener);
        });
        keyPressPromise.then((key) => { // Note that it's now the key, not keyCode
            let e = CorrectSpaceKeys(key)
            let keysAlreadyRegister = Object.values(keyboardConfig);
            if (!keysAlreadyRegister.includes(e)) {
                UpdateKeys(key, button.id); // Ensure UpdateKeys function can handle the change from event.code to event.key
                LoadKeys();
            } else {
                e = CorrectSpaceKeys(e);
                let conflictingAction = GetActionFromKey(e, keyboardConfig);

                let actionBtn = GetAction(button.id);
                let keyBtn = GetKeyFromAction(actionBtn, keyboardConfig);
                // keyBtn = CorrectSpaceKeys(keyBtn);

                // console.log("Nouvelle touche ", e, " qui existe déjà à l'action :", conflictingAction, " key btn:", keyBtn, " action btn:", actionBtn);

                switch (actionBtn) {
                    case "right":
                        keyboardConfig.right = e;
                        break;
                    case "left":
                        keyboardConfig.left = e;
                        break;
                    case "shoot":
                        keyboardConfig.shoot = e;
                        break;
                    default: //pause
                        keyboardConfig.pause = e;
                        break;
                }
                switch (conflictingAction) {
                    case "right":
                        keyboardConfig.right = keyBtn;
                        break;
                    case "left":
                        keyboardConfig.left = keyBtn;
                        break;
                    case "shoot":
                        keyboardConfig.shoot = keyBtn;
                        break;
                    default: //pause
                        keyboardConfig.pause = keyBtn;
                        break;
                }
                LoadKeys();
                // swap les touches
            }
            SetInterfaceVisibility("keyboard");
        });
    });
});

//Pause Action
document.addEventListener('keydown', function (event) {
    if (event.key === keyboardConfig.pause) {
        if (!set.inMenu) {
            PauseGame();
        }
    }
});
function restartAudio() {
    dickSounds.music.currentTime = 0; // Réinitialiser au début de la piste
    dickSounds.music.play(); // Reprendre la lecture
}
// Écouter l'événement 'ended' de l'élément audio
if (dickSounds.music != null) {
    dickSounds.music.addEventListener('ended', restartAudio);
}

window.addEventListener("resize", function () {
    set.gameDivWidth = document.getElementById("game").offsetWidth;
    set.gameCenter = set.gameDivWidth / 2;
    set.posPlayerX = set.gameCenter - 30;
    set.posPlayerY = set.gameDiv.offsetHeight - 30 - document.getElementById("bot").offsetHeight;
    // set.monsterParent.SetPosition();
    set.player.position.y = set.posPlayerY;
    set.player.setPosition();
    set.monsterParent.gameCenter = set.gameDivWidth;
})
loadTools();
loadBullets();
game();
