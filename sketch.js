const WIDTH = 500;
const HEIGHT = 360;
const SIZE = 50;
var amount = 0;

var score = 0;
var maxScore = 0;

let moleImg;
var mole;
let holes = [];
var game;
class Game {
    constructor(run, waitTime, loseAmount, level) {
        this.run = run;
        this.waitTime = waitTime;
        this.loseAmount = loseAmount;
        this.level = level || 1;
    }
}

//buttons
let button;
var mainMenu;
let playAgain;
class Mole {
    constructor(born, hole) {
        this.born = born;
        this.hole = hole;
    }
}

// var positions = [
//                  [[WIDTH/9, HEIGHT/9]],[[WIDTH/3, HEIGHT/9]],[],
//                  [],[],[],
//                  [],[],[]
//                ];

let mazeImg;
let smashSound;

async function setup() {
    createCanvas(WIDTH, HEIGHT);
    frameRate(24);
    mazeImg = await loadImage("/assets/maze.png");
    moleImg = await loadImage("/assets/mole.png");
    effectImg = await loadImage("/assets/effect.gif");

    smashSound = await loadSound("/assets/smash.wav");
    spawnSound = await loadSound("/assets/spawn.wav");

    game = new Game({ run: false, waitTime: 45, loseAmount: 3, level: 1 });
    mole = new Mole(0, -1);

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            holes.push({
                x: ((c + 0.5) * WIDTH) / 3,
                y: ((r + 0.5) * HEIGHT) / 3,
            });
        }
    }

    mainMenu = createButton("Main menu");
    mainMenu.position(WIDTH / 2 - 100, height / 2 + 35);
    mainMenu.mousePressed(gotoMenu);

    playAgain = createButton("Play Again");
    playAgain.position(WIDTH / 2, height / 2 + 35);
    playAgain.mousePressed(startGame);

    button = createButton("Play");
    button.position(WIDTH / 2 - 100, height / 2);
    button.mousePressed(startGame);
    button.style("font-size", "24px", "font-family", "Arial", "border", "0");
}

function draw() {
    background(15, 10, 25);
    if (game.run === true) {
        if (amount > game.loseAmount) {
            background(15, 10, 25);
            textSize(24);
            fill(255);
            stroke(0);
            strokeWeight(4);
            textAlign(CENTER, CENTER);
            text("Game Over D:", WIDTH / 2, height / 2);
            mainMenu.show();
            playAgain.show();
            button.hide();
            textSize(16);
            text(`Score: ${score} & Max Score: ${maxScore}`, WIDTH / 2 - 10, HEIGHT / 1 - 100);
            noSmooth();
        } else {
            background(15, 10, 25);
            mainMenu.hide();
            playAgain.hide();
            button.hide();
            textSize(24);
            fill(255);
            stroke(0);
            strokeWeight(4);
            textAlign(CENTER, CENTER);
            text("Mack-A-Pumpkin!", WIDTH / 2, 50);

            noStroke();

            if (frameCount - mole.born > speedByLevel(game.level)) {
                let nuevo;
                do {
                    nuevo = int(random(9));
                } while (nuevo === mole.hole);
                mole.hole = nuevo;
                mole.born = frameCount;
                amount++;
                spawnSound.play();
                console.log("Amount: " + amount);
            }
            if (mole.hole >= 0) {
                let h = holes[mole.hole];
                image(moleImg, h.x - SIZE / 2, h.y - SIZE / 2, 64, 64);
            }
            cursor("/assets/maze.png");

            textSize(24);
            fill(255);
            stroke(0);
            strokeWeight(4);
            text(`Score: ${score}`, WIDTH - 70, HEIGHT - 30);
            noSmooth();
        }
    } else {
        background(15, 10, 25);
        textSize(24);
        fill(255);
        stroke(0);
        strokeWeight(4);
        textAlign(CENTER, CENTER);
        text("Mack-A-Pumpkin!", WIDTH / 2, 50);
        button.show();

        mainMenu.hide();
        playAgain.hide();
    }
}

function startGame() {
    score = 0;
    amount = 0;
    mole = new Mole(-1, 0);
    game.run = true;
}
function gotoMenu() {
    game.run = false;
}

function mousePressed() {
    if (amount >= 3) {
        score = 0;
        amount = 0;
        mole = new Mole(-1, 0);
        return;
    }

    if (mole.hole < 0) return;

    const h = holes[mole.hole];
    if (dist(mouseX, mouseY, h.x, h.y) < 40) {
        score++;
        spawnSound.stop();
        image(effectImg, mouseX - SIZE / 2, mouseY - SIZE / 2, 64, 64);
        effectImg.play();
        if (score > maxScore) {
            maxScore = score;
        }
        if (score > 10) {
            game.level = 2;
        } else if (score > 20) {
            game.level = 3;
        } else if (score > 30) {
            game.level = 4;
        }
        mole.hole = -1;
        mole.born = frameCount;
        smashSound.play();

        amount = 0;
    }
    console.log(score);
    console.log("Amount: " + amount);
}

function speedByLevel(level) {
    switch (level) {
        case 1:
            return 45;
        case 2:
            return 30;
        case 3:
            return 15;
        case 4:
            return 10;
        default:
            break;
    }
}
