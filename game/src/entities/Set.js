import { Player } from "./Player.js";
import { Monsters } from "./Monsters.js";
import { Extra } from "./Monster.js";
let gameDiv = document.getElementById("game");
let gameDivWidth = document.getElementById("game").offsetWidth;
let gameCenter = gameDivWidth / 2;

export let set = {
    isGameOver: false,
    isWin: false,
    inMenu: true,
    extraAppeared: false,
    extraDisappeared: false,
    modeJson: "",
    currentLvl: 0,
    isEndless: false,
    loopGame: 0,
    player: new Player(gameDivWidth),
    monsterParent: new Monsters(gameDivWidth),
    extraVar: new Extra(),
    remainingEnemies: 0,
    divParentMonsters: document.getElementById("monsters"),
    gameDiv: document.getElementById("game"),
    gameDivWidth: document.getElementById("game").offsetWidth,
    gameCenter: gameDivWidth / 2,
    posPlayerX: gameCenter - 30,
    posPlayerY: gameDiv.offsetHeight - 30 - document.getElementById("bot").offsetHeight,

    monstersObj: [],
    visibleMonsters: [],
    bulletsObj: [],
    bulletsMonsterObj: [],

    MAXIMUM_PLAYER_SHOOT: 30,

    livesDiv: document.getElementById("livesDiv"),
    livesImgDisplay: document.getElementById("livesImg"),
    livesCountDisplay: document.getElementById("livesCount"),

    score: 0,
    displayScore: document.createElement("div"),
    currentPlaybackTime: 0,

    chainP: document.createElement("p"),
    lastEnnemyDestroyed: "",
    chain: 0,
    chainMult: document.getElementById("chainMult"),
    bonusScore: document.getElementById("bonusScore"),

    form: document.getElementById("form"),
}

export let dickSounds = {
    "bonus": new Audio("/template/style/soundtracks/bonus.wav"),
    "shoot": new Audio("/template/style/soundtracks/shoot.wav"),
    "enemy_death": new Audio("/template/style/soundtracks/enemy_death.wav"),
    "enemy_shoot": new Audio("/template/style/soundtracks/enemy_shoot.wav"),
    "music": new Audio("/template/style/soundtracks/space_invader.mp3"),
    "enemy_move": new Audio("/template/style/soundtracks/enemy_move.wav")
}