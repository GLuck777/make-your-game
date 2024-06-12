export const level = {
    0: {
        0: ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
        1: ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
        2: ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
        3: ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
    },
    1: {
        0: ["yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow"],
        1: ["green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green"],
        2: ["yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow"],
        3: ["green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green", "yellow", "green"],
    },
    2: {
        0: ["yellow", "green", "yellow", "green", "yellow", "green", "yellow", "red", "yellow", "green", "yellow", "green", "yellow", "green", "yellow"],
        1: ["green", "yellow", "green", "yellow", "green", "yellow", "green", "red", "green", "yellow", "green", "yellow", "green", "yellow", "green"],
        2: ["yellow", "green", "yellow", "green", "yellow", "green", "yellow", "red", "yellow", "green", "yellow", "green", "yellow", "green", "yellow"],
        3: ["green", "yellow", "green", "yellow", "green", "yellow", "green", "red", "green", "yellow", "green", "yellow", "green", "yellow", "green"],
    },
}
// export const level = {
//     0: {
//         0: ["red"],
//     },
//     1: {
//         0: ["red"],
//     },
//     2: {
//         0: ["red"],
//     },
// }

export const history = {
    0: "Three years ago, an alien race, the Galactarian Nexusians, challenged us to protect our own planet. " +
        "During those three years, all countries developed together a secret, overpowering, ultra-mobile supertank " +
        "capable of shooting a hyperbullet through the stratosphere to destroy a ninety-kilometer asteroid. " +
        "For the first time in the history of mankind, all countries worked together without conflict. If was a peacefull period but... " +
        "HERE THEY ARE!!! A yellow alien soldier wave is comming. The peace is over. " +
        "Soldier, you have been chosen among the elite to protect our planet. Good Luck!"
    ,
    1: "Well done soldier! A wave of alien have been slained but now we know they were only cannon fodders. " +
        "Another wave is comming. This time we detected another kind of ship : green ship. We think they will be more dangerous. " +
        "Be carefull soldier, the war isn't over."
    ,
    2: "That was awesome! It seem they're going to be out of soldiers. " +
        "Red ship detected, they're probably leaders of the Galactarian Nexusians army. " +
        "Hold on soldier, this is the last wave! Victory is near!"
    ,
    3: "Congratulations, soldier! Today is a great day, you have saved the Earth AND... Our reputation! " +
        "The Galactarian Nexusians's leader is about to issue a statement once and for all confirming that " +
        "Earth's pizzas are better than Galactarian Nexusians's blorgzza! Your planet and Stellar Slice Pizzeria are proud of you!"
};

export const looseMsg = {
    0: "You goddamn little piece of sh*t! You ruined three years of preparation! " +
        "Less than a wave ? Really !? " +
        "Because of you I lost the bet with the Galactarian Nexusians's leader. " +
        "Dishonor on you! Dishonor on your cow! Dishonor on your whole family!"
    ,
    1: "You disappointed me, you disappointed your clan and you disappointed humanity. " +
        "Because of you, we lost the most important bet of all times, because of you, the world will no longer be the same! " +
        "Your failure will have serious consequences..."
    ,
    2: "You tried, but you failed... " +
        "You did your best, but you weren't strong enough to face The Galactarian Nexusians' greatest warriors. " +
        "Now I have to accept the bet we lost against them, I have to acknowledge our defeat, and I have to admit that... " +
        "Their blorgzza are better than our pizzas... " +
        "Shame on you, soldier! Stellar Slice Pizzeria and your government disown you."
};

export let infiniteLevel = {};

function choisirCouleurAleatoire() {
    
    // Générer un nombre aléatoire entre 0 et 1
    const random = Math.random();

    // Définir les probabilités de chaque couleur
    const yellowProb = 0.5;  // 50%
    const greenProb = 0.35;  // 35%
    const redProb = 0.15;    // 15% est la pour la forme

    // Déterminer la couleur en fonction du nombre aléatoire généré
    if (random < yellowProb) {
        return "yellow";
    } else if (random < yellowProb + greenProb) {
        return "green";
    } else {
        return "red";
    }
}

export function generateMapMonster() {
    // Déterminer le numéro de la prochaine propriété numérique
    const prochaineProprieteNumerique = Object.keys(infiniteLevel).length;

    // Créer un tableau de 15 éléments avec des couleurs aléatoires
    const firstLine = Array(15).fill().map(choisirCouleurAleatoire);
    const secondLine = Array(15).fill().map(choisirCouleurAleatoire);
    const thirdLine = Array(15).fill().map(choisirCouleurAleatoire);
    const fourthLine = Array(15).fill().map(choisirCouleurAleatoire);

    infiniteLevel[prochaineProprieteNumerique] = {
        0: firstLine,
        1: secondLine,
        2: thirdLine,
        3: fourthLine
    };
}
// Reset object
export function ClearLevel() {
    infiniteLevel = {};
}