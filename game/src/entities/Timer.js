let countDownSec = 0;
let countDownMin = 0;

let actualTime;

export function timerStart(reset = null) {
    if (reset == null) {

        // Obtenez la référence de la div
        let myTimer = document.getElementById("time");
        countDownSec++;
        if (countDownSec === 60) {
            countDownMin++;
            countDownSec = 0;
        }
        // Formatage du texte pour l'affichage
        let formatedMinutes = countDownMin < 10 ? "0" + countDownMin : countDownMin;
        let formatedSeconds = countDownSec < 10 ? "0" + countDownSec : countDownSec;
        actualTime = formatedMinutes+":"+formatedSeconds;

        // Mise à jour du contenu avec le compte à rebours
        // console.log("my timer:", myTimer);
        if (myTimer.innerText !== null){
            myTimer.innerText = formatedMinutes + ":" + formatedSeconds;
        }

        // Reset du compteur une fois que le temps atteint 99:99
        if (countDownMin === 99 && countDownSec === 99) {
            countDownSec = 0;
            countDownMin = 0;
        }
    } else {
        countDownSec = -1;
        countDownMin = 0;
    }
}


//Called for getting the time left of the game
export function GetTimeLeft(){
    return actualTime;
}