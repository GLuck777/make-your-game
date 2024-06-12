import { set, dickSounds } from "./Set.js";
import { Rect } from "../entities/Rect.js";
import { Vector2 } from "../entities/Vector.js";
import { ConvertSizeCSSValueToInt, GetPosition, GetSize } from "../entities/System.js";
import { level, infiniteLevel } from "./Level.js";
import { Monster } from "./Monster.js";

let MAXIMUM_ENNEMY_SHOOT = 30;
let chronoEnnemyShoot = 0;
let chainMonster = document.getElementById("chainMonster");
let chainMonsterDiv = document.getElementById("chainMonsterDiv");
let bonusChain = document.getElementById("bonusChain");
//Called for the monsters
export function MonsterRuntime() {
    if (chronoEnnemyShoot > 0) {
        chronoEnnemyShoot--;
    } else if (chronoEnnemyShoot == 0) {
        chronoEnnemyShoot = MAXIMUM_ENNEMY_SHOOT;
        // test: utilisation du tableau qui slice tous les ennemies mort 
        //permet de ne selectionner que les ennemies en vie donc les bullets continues 
        let indexMonster = Math.floor(Math.random() * (set.visibleMonsters.length - 1));
        if (indexMonster > -1) {
            Shoot("monster", set.visibleMonsters[indexMonster]);
        }
    }
}

export function BulletRuntime() {
    const offsetLeftMonsters = set.divParentMonsters.offsetLeft;
    const offsetTopMonsters = set.divParentMonsters.offsetTop;
    const offsetHeightMonsters = set.divParentMonsters.offsetHeight;
    set.bulletsMonsterObj.forEach((bulletObj) => {
        if (!bulletObj.IsFired) return;

        let playerRect = new Rect(60, 30).Set(set.player.position.x, set.player.position.y);
        const playerRectAdjusted = {
            x: playerRect.x,
            w: playerRect.w,
            y: playerRect.y,
            h: playerRect.h + playerRect.y
        };
        if (bulletObj.CanBeDestroyed(set.player.position.y + 30)) {
            bulletObj.IsFired = false;
            return;
        }
        bulletObj.Move();
        bulletObj.setPosition();
        if (bulletObj.Shooter === "monster") {
            if (bulletObj.position.x >= playerRectAdjusted.x && bulletObj.position.x <= playerRectAdjusted.w) {
                if (bulletObj.position.y > playerRectAdjusted.y && bulletObj.position.y < playerRectAdjusted.h) {
                    set.player.HitByEnnemyBullet();
                    set.livesCountDisplay.innerHTML = " x " + set.player.Lives;
                    set.livesDiv.appendChild(set.livesCountDisplay);
                    bulletObj.Destroy();
                }
            }
        }
    });
    set.bulletsObj.forEach((bulletObj) => {

        if (!bulletObj.IsFired) return;

        if (bulletObj.CanBeDestroyed()) {
            bulletObj.IsFired = false;
            return;
        }
        bulletObj.Move();
        bulletObj.setPosition();
        //Première sécurité pour empecher la bullet de repérer quoi que se soit
        if (bulletObj.position.y >= offsetTopMonsters + offsetHeightMonsters + 30) return;
        set.monstersObj.forEach((monsterDiv, indexMonster) => {

            let monsterPosition = {
                x: monsterDiv.divElement.offsetLeft,
                y: monsterDiv.divElement.offsetTop
            };
            let monsterSize = GetSize(monsterDiv.divElement.style);
            let monsterRect = new Rect(monsterSize.x, monsterSize.y).Set(monsterPosition.x, monsterPosition.y);

            //ajustement selon son parent
            const monsterRectAdjusted = {
                x: monsterRect.x + offsetLeftMonsters,
                w: monsterRect.w + offsetLeftMonsters,
                y: monsterRect.y + offsetTopMonsters,
                h: monsterRect.h + offsetTopMonsters
            };
            if (bulletObj.Shooter === "player") {
                if (bulletObj.position.x >= monsterRectAdjusted.x && bulletObj.position.x <= monsterRectAdjusted.w) {
                    if (bulletObj.position.y > monsterRectAdjusted.y && bulletObj.position.y < monsterRectAdjusted.h) {
                        if (set.monstersObj[indexMonster].Alive) {
                            bulletObj.Destroy();
                            set.monstersObj[indexMonster].HitByBullet();
                            if (!set.monstersObj[indexMonster].Alive) {

                                if (set.lastEnnemyDestroyed == set.monstersObj[indexMonster].color) {
                                    set.chain++;
                                    set.chainP.innerHTML = set.chain + "/4";
                                    chainMonsterDiv.style.visibility = "visible";
                                    bonusChain.style.visibility = "hidden";
                                    set.chainMult.style.visibility = "visible";

                                    if (set.chain == 4) {

                                        if (dickSounds.bonus != null) {
                                            dickSounds.bonus.play();
                                            dickSounds.bonus.volume = 0.7;
                                        }
                                        set.bonusScore.innerText = "+" + set.monstersObj[indexMonster].Points;
                                        bonusChain.style.visibility = "visible";
                                        set.chainMult.style.visibility = "hidden";
                                        chainMonsterDiv.style.visibility = "hidden";
                                        set.score += set.monstersObj[indexMonster].Points;
                                        set.chain = 0;
                                        set.chainP.innerHTML = "";
                                    }
                                } else {
                                    
                                    set.lastEnnemyDestroyed = set.monstersObj[indexMonster].color;
                                    set.chain = 1;
                                    set.chainP.innerHTML = set.chain + "/4";
                                    bonusChain.style.visibility = "hidden";
                                    chainMonsterDiv.style.visibility = "visible";
                                    set.chainMult.style.visibility = "visible";
                                }
                                chainMonster.src = "/template/style/ressources/" + set.monstersObj[indexMonster].color + ".png"

                                if (dickSounds.enemy_death != null) {
                                    dickSounds.enemy_death.volume = 0.2;
                                    dickSounds.enemy_death.play();
                                }
                                set.score += set.monstersObj[indexMonster].Points;
                                set.displayScore.innerHTML = "Score:" + set.score;
                                //test: système de gestion pour shoot
                                if (indexMonster >= 0 && indexMonster < set.visibleMonsters.length) {
                                    set.visibleMonsters.splice(indexMonster, 1);
                                }
                                checkInactiveColumns()

                                set.remainingEnemies--;
                                if (set.remainingEnemies == 0) {
                                    set.remainingEnemies = null;
                                }
                            }
                        }
                    }
                }
            }
        });
        set.extraVar.Colllide(bulletObj);

    });
}

export function Shoot(shooter, monster = null) {
    let bulletIndexAvalaible;
    // let shooter = new Audio("template/style/ressources/soundtracks/shoot.wav");
    switch (shooter) {
        case "player":
            bulletIndexAvalaible = getBulletIndexStillAvalaible(0, set.MAXIMUM_PLAYER_SHOOT, set.bulletsObj);
            if (bulletIndexAvalaible != -1 && bulletIndexAvalaible < 5) {
                set.bulletsObj[bulletIndexAvalaible].IsFired = true;
                let bulletPos = new Vector2(set.player.position.x, set.player.position.y);
                set.bulletsObj[bulletIndexAvalaible].Spawn(bulletPos.x + 25, bulletPos.y - 10, "player");
                set.bulletsObj[bulletIndexAvalaible].Shooter = "player";
            }
            if (dickSounds.shoot != null) {
                dickSounds.shoot.play();
                dickSounds.shoot.volume = 0.7;
            }
            break;
        default: //Monster
            bulletIndexAvalaible = getBulletIndexStillAvalaible(0, set.bulletsMonsterObj.length, set.bulletsMonsterObj);
            if (bulletIndexAvalaible != -1) {
                if (!set.bulletsMonsterObj[bulletIndexAvalaible].IsFired) {
                    if (monster.Alive) {
                        set.bulletsMonsterObj[bulletIndexAvalaible].IsFired = true;
                        let bulletPos = monster.GetGlobalPosition();
                        bulletPos.x += (monster.Sprite.img.width / 2) - 5;
                        bulletPos.y += (monster.Sprite.img.height);

                        set.bulletsMonsterObj[bulletIndexAvalaible].SetSpeedByEnemyType(monster.color)
                        set.bulletsMonsterObj[bulletIndexAvalaible].Spawn(bulletPos.x, bulletPos.y, "monster");
                        if (dickSounds.enemy_shoot != null) {
                            dickSounds.enemy_shoot.play();
                            dickSounds.enemy_shoot.volume = 0.1;
                        }
                    }
                }
            }
            break;
    }
}

//Called for getting the index value
function getBulletIndexStillAvalaible(min, max, bulletsObjLocal) {
    for (let i = min; i < max; i++) {
        let obj = bulletsObjLocal[i];
        if (obj !== undefined) {
            if (obj.IsFired === false) {
                return i;
            }
        } else {
            return -1;
        }
    }
    return -1;
}

// Fonction pour vérifier si une colonne est complètement inactive
function checkInactiveColumns() {

    let rightSide = 0;
    let leftSide = 99999999;
    //Check Column
    set.visibleMonsters.forEach((monster) => {
        if (monster.position.x > rightSide) {
            rightSide = monster.position.x
        }
        if (monster.position.x < leftSide) {
            leftSide = monster.position.x
        }
    })
    rightSide += 40;

    set.divParentMonsters.style.width = rightSide - leftSide + "px";

    if (leftSide > 0) {
        set.monsterParent.position.x += leftSide;
        set.divParentMonsters.style.left = set.monsterParent.position.x + "px";
    }

    set.visibleMonsters.forEach((monster) => {
        monster.position.x = monster.position.x - leftSide;
        monster.SetPosition()
    });

    //Check Lign
    let bottomSide = 0;
    set.visibleMonsters.forEach((monster) => {
        if (monster.position.y > bottomSide) {
            bottomSide = monster.position.y
        }
    })
    bottomSide += 32
    set.divParentMonsters.style.height = bottomSide + "px";
}