// board
let board;
let boardWidth = 500; // largeur en px
let boardHeight = 500; // longueur en px

// player
let player;
let playerWidth = 80;
let playerHeight = 8;
let playerVelocityX = 11;

let playerState = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 100,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX,
}

// ball
let ball;
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;  

let ballState = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
}

let startMove = false;

let status;
let loose;
let life = 3;
let lifeDisplay;
let xp = 0;
let xpDisplay;



window.onload = function() {
    board = document.getElementById("board");
    player = document.getElementById("player");
    ball = document.getElementById("ball");
    status = document.getElementById("status");
    lifeDisplay = document.getElementById("lifeDisplay");
    xpDisplay = document.getElementById("xpDisplay");
    //continuee = document.getElementById("continuee")
    //restarte = document.getElementById("restarte")


    // Positionner initialement
    updatePlayerPosition();
    updateBallPosition();

    document.addEventListener("keydown", stopEsc)

    // Fonction pour l'animation du joueur
    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    createBlocks();
}

function update() {
    // Met à jour position balle et joueur
    updatePlayerPosition();
    updateBallPosition();
    moveBall();


    requestAnimationFrame(update);
}

function updatePlayerPosition() {
    player.style.left = playerState.x + "px";
    player.style.top = playerState.y + "px";
}

function updateBallPosition() {
    ball.style.left = ballState.x + "px";
    ball.style.top = ballState.y + "px";
}

function movePlayer(event) {
    // Identifie fleche de gauche et droite  
    if (event.key === "ArrowLeft") {
        // math.max(0,...) détermine la bordure
        playerState.x = Math.max(0, playerState.x - playerVelocityX);
        startMove = true;
    } else if (event.key === "ArrowRight") {
        // Math min determine la bordure ( longeurBoard - longueurJoueur)
        playerState.x = Math.min(boardWidth - playerWidth, playerState.x + playerVelocityX);
        startMove = true;
    }
    updatePlayerPosition();

    if (startMove) {
        status.innerText = "";
    }
}

function moveBall() {
    if (startMove === false) {
        status.innerText = "Press Right or Left";
        return;
    }

    // Met à jour la position de la balle
    ballState.x = ballState.x + ballState.velocityX;
    ballState.y = ballState.y + ballState.velocityY;

    // Collision avec les bords du plateau
    if (ballState.x <= 0 || ballState.x + ballState.width >= boardWidth) {
        ballState.velocityX *= -1;
    }
    if (ballState.y <= 0 || ballState.y + ballState.height >= boardHeight) {
        ballState.velocityY *= -1;
    }

    // Collision avec les blocs
    checkCollisionWithBlocks();

    // Collision avec le joueur
    if (ballState.y + ballState.height >= playerState.y && ballState.x + ballState.width >= playerState.x && ballState.x <= playerState.x + playerState.width && ballState.y <= playerState.y + playerState.height) {
        ballState.velocityY *= -1;
        ballState.y = playerState.y - ballState.height;
        xpGenerator();
    }

    // Gestion du game over
    if (ballState.y + ballState.height >= boardHeight) {
        startMove = false;
        ballVelocityX = 0;
        ballVelocityY = 0;
        life--;
        lifeDisplay.innerText = "Life: " + life;
        ballState.x = boardWidth / 2 - ballWidth / 2;
        ballState.y = boardHeight / 2 - ballHeight / 2;
        
        restart();
    }
}


function xpGenerator() {
    xp += 500;
    xpDisplay.innerText = "XP: " + xp;
}

function restartGame() {
    // Réinitialiser toutes les variables du jeu
    life = 3;
    xp = 0;
    startMove = false;
    
    // Réinitialiser l'affichage
    lifeDisplay.innerText = "Life: " + life;
    xpDisplay.innerText = "XP: " + xp;
    status.innerText = "Press Right or Left";

    // Réinitialiser la position du joueur et de la balle
    playerState.x = boardWidth / 2 - playerWidth / 2;
    playerState.y = boardHeight - playerHeight - 100;
    ballState.x = boardWidth / 2 - ballWidth / 2;
    ballState.y = boardHeight / 2 - ballHeight / 2;


    // Redémarrer le jeu, le if est fait avec gpt je comprends pas si on enleve cela vas creer un bug de vitesse
    if (startMove) {
        requestAnimationFrame(update);
    }
    createBlocks();
}

function restart() {
    if (life === 0) {
        restartGame();
    }
}


//-------------------------------------------------------------------------------------------------------------------------------//

let blocks = [];
let numBlocksX = 6; // Nombre de blocs en largeur
let numBlocksY = 5; // Nombre de blocs en hauteur

let blockWidth = 70; // Largeur d'un bloc
let blockHeight = 20; // Hauteur d'un bloc

let startX = 20; // Position x de départ du premier bloc
let startY = 20; // Position y de départ du premier bloc


function createBlocks() {
    // Boucle pour créer les blocs
    for (let i = 0; i < numBlocksY; i++) {
        for (let j = 0; j < numBlocksX; j++) {
            let block = {
                x: startX + j * (blockWidth + 10), // Coordonnée x du bloc
                y: startY + i * (blockHeight + 10), // Coordonnée y du bloc
                width: blockWidth,
                height: blockHeight,
                element: document.createElement("div")
            };
            block.element.classList.add("block"); // Ajouter la classe CSS pour le style du bloc
            block.element.style.left = block.x + "px"; // Définir la position left du bloc
            block.element.style.top = block.y + "px"; // Définir la position top du bloc

            // Ajouter le bloc à la liste des blocs
            blocks.push(block);

            // Ajouter le bloc au tableau
            document.getElementById("board").appendChild(block.element);
        }
    }
}


function checkCollisionWithBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        //  a partir du moment ou y'a une collision entre les x et y de la balle et des block
        if ( ballState.x < block.x + block.width && ballState.x + ballState.width > block.x && ballState.y < block.y + block.height && ballState.y + ballState.height > block.y) {
            ballState.velocityY *= -1;



            // Supprimer le bloc de la liste des blocs et du DOM
            blocks.splice(i, 1);
            block.element.remove();

            xpGenerator();
        }
    }
}

//---------------------------------------------------------------------------------------------------------------//


function stopEsc(event2) {
    if ( event2.key === "Escape" ) {
        startMove = false;
    }
    

}



