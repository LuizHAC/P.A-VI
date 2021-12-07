function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

//window.resizeBy(1980,1080);

// Creating the Entity class
class Entity {
    constructor({ tag = 'div'} = {}) {
        this.el = document.createElement(tag);
        this.el.style.position = 'absolute';
        document.body.appendChild(this.el);
    }
    
    // Set the position from a given x, y
    setPosition(x, y){
        this.x = x;
        this.y = y;

        this.el.style.left = `${this.x}vw`;
        this.el.style.position = 'absolute';
        this.el.style.top = `${this.y}vw`;
    }
    
    // Remove this element
    remove() {
        this.el.remove();
        this.el = null;
    }

    // Explosion animation
    explode(){
        this.el.src = '../../Assets/Game/explosion.png';
    }
}

// Creating the ship class and inheriting from the Entity class to set class name, positions, creat elements and setPosition
class Ship  extends Entity{
    constructor() {
        super({tag: 'img', player});

        this.player = player
        this.setShip()
        this.speed = 0.15;
        this.canShot = true;
        this.el.className = 'ship';
        this.setPosition(48, 40)
    }

    // Set the space ship color
    setShip(){
        this.el.src = '../../Assets/Game/ship.png';

        if (player == 1){
            this.el.style.filter = 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)';
        }

        if (player == 2){
            this.el.style.filter = 'sepia(100%) hue-rotate(140deg) brightness(60%) saturate(1000%)';
        }
    }

    // Move the ship to the right and to the left
    moveRight(){
        this.setPosition(this.x + this.speed, this.y);
    }

    moveLeft(){
        this.setPosition(this.x - this.speed, this.y);
    }

    // Creating a function to shot and to apply a cooldown between the consecutive shots
    shot({createBullet, x, y, id}){
        
        if(this.canShot){
            this.canShot = false;

            createBullet({x: x, y: y, id});
            setTimeout( () => {
                this.canShot = true;
            }, .2);
        }
    }
}

// Creating the Bullet class
class Bullet extends Entity{
    constructor({x, y, id}){
        super();

        this.speed = 0.14;
        this.id = id
        this.el.className = 'bullet';
        this.setColor()
        this.el.style.width = `${0.7}vw`;
        this.el.style.height = `${1}vw`;

        this.setPosition(x, y);
    }

    update(){
        if(this.id == 0){
            this.setPosition(this.x, this.y + this.speed);
        }
        else{
            this.setPosition(this.x, this.y - this.speed);
        }
    }

    setColor(){
        if(this.id == 1){
            this.el.style.backgroundColor = 'red';
        }
        else if(this.id == 2){
            this.el.style.backgroundColor = 'blue';
        }
        else{
            this.el.style.backgroundColor = 'green'
        }
    }
}

// Creating the Alien class
class Alien extends Entity{
    constructor({x, y, type, getOverlapBullet, removeAlien, removeBullet, addScore, row, col}){
        super({tag: 'img'});

        this.setImage(type);
        this.direction = 'left';
        this.speed = 0.06;
        this.setPosition(x, y);
        this.getOverlapBullet = getOverlapBullet;
        this.removeAlien = removeAlien;
        this.removeBullet = removeBullet;
        this.addScore = addScore;
        this.canShot = true;
        this.el.className = 'alien';
        this.row = row;
        this.col = col;
    }

    // Setting the alien image using it's row
    setImage(type){
        if(type == 1){
            this.el.src = '../../Assets/Game/enemy1.png';
            this.score = 15;
        }
        else if(type == 2){
            this.el.src = '../../Assets/Game/enemy2.png';
            this.el.style.filter = 'invert(100%) sepia(31%) saturate(4000%) hue-rotate(54deg) brightness(100%) contrast(82%)';
            this.score = 10;
        }
        else if(type == 3){
            this.el.src = '../../Assets/Game/enemy3.png';
            this.el.style.filter = 'invert(82%) sepia(47%) saturate(566%) hue-rotate(9deg) brightness(97%) contrast(84%)';
            this.score = 5;
        }
        else if(type == 4){
            this.el.src = '../../Assets/Game/enemy4.png';
            this.el.style.filter = 'invert(44%) sepia(58%) saturate(3969%) hue-rotate(246deg) brightness(86%) contrast(91%)';
            this.score = 3;
        }
    }

    // Moving the Alien
    moveRight(){
        this.direction = 'right';
    }

    moveLeft(){
        this.direction = 'left';
    }

    moveDown(){
        this.setPosition(this.x, this.y + this.speed * 5);
    }

    update(){
        if(this.direction === 'left'){
            this.setPosition(this.x - this.speed, this.y);
        }
        else{
            this.setPosition(this.x + this.speed, this.y);
        }

        const overlap = this.getOverlapBullet(this);
        if (overlap && overlap.id != 0){
            this.addScore(this.score);
            this.removeAlien(this);
            this.removeBullet(overlap);
        }
    }

    // Creating a function to shot and to apply a cooldown between the consecutive shots
    shot({createBullet, x, y, id}){
        
        if(this.canShot){
            this.canShot = false;
            createBullet({x: x, y: y, id});
            setTimeout( () => {
                this.canShot = true;
            }, 2000);
        }
    }
}

// Setting the main keys (up, down, space)
const KEY_RIGHT = 39;
const KEY_LEFT = 37;
const KEY_SPACE = 32

const keys = {
    right: false,
    left: false,
    space:false
}

// Key Presses
function KeyPress(event) {
    if (event.keyCode === KEY_RIGHT) {
        keys.right = true;
        console.log(keys)
    } else if (event.keyCode === KEY_LEFT) {
        keys.left = true;
    } else if (event.keyCode === KEY_SPACE) {
        keys.space = true;
    }
}

// Key Releases
function KeyRelease(event) {
    if (event.keyCode === KEY_RIGHT) {
        keys.right = false;
    } else if (event.keyCode === KEY_LEFT) {
        keys.left = false;
    } else if (event.keyCode === KEY_SPACE) {
        keys.space = false;
    }
}

window.addEventListener("keydown", KeyPress);
window.addEventListener("keyup", KeyRelease);

const ship = new Ship(player=1);
const bullets = [];
const aliens = [];
let game = true;
let score = 0;

const addScore = (points) => {
    score += points;
    var element = document.getElementById("red-score");
    element.textContent = "Score: " + score;
};


const removeAlien = (alien) => {
    aliens.splice(aliens.indexOf(alien), 1);
    alien.explode();
    alien.remove();
};

// Removing the bullet element (so we don't have infinite bullet elements)
const removeBullet = (bullet) => {
    bullets.splice(bullets.indexOf(bullet), 1);
    bullet.remove();
};

const isOverlap = (entity1, entity2) => {
    const rect1 = entity1.el.getBoundingClientRect();
    const rect2 = entity2.el.getBoundingClientRect();

    return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
    );
}

const getOverlapBullet = (entity) => {
    for (let bullet of bullets){
        if (isOverlap(entity, bullet)){
            return bullet;
        }
    }
    return null;
}

const Aliens_Rows = 4;
const Aliens_Cols = 10;

// Creating the enemies
for (let row = 1 ; row <= Aliens_Rows; row++){
    for (let col = 1; col <= Aliens_Cols; col++){
        const alien = new Alien({x: col * 7 + 23, y:row * 6, type:row, getOverlapBullet, removeAlien, removeBullet, addScore, row, col});
        aliens.push(alien);
    }
}

// Creating a bullet
const createBullet = ({x, y, id}) => {
    if(id == 0){
        bullets.push(new Bullet({x: x + 1.65, y: y + 2.5, id: id}));
    } else {
        bullets.push(new Bullet({x: x + 1.65, y: y - 0.5, id: id}));
    }
}

// Catch the aliens closest to crashing into the wall
const getClosestAlien = (direction) => {

    if(direction === 'left'){
        return aliens.reduce((minimumAlien, currentAlien) => {
            return currentAlien.x < minimumAlien.x
              ? currentAlien
              : minimumAlien;
          });
    };
    if(direction === 'right'){
        return aliens.reduce((maximumAlien, currentAlien) => {
            return currentAlien.x > maximumAlien.x
            ? currentAlien
            : maximumAlien;
        });
    };
    if(direction === 'down'){
        return aliens.reduce((lohestAlien, currentAlien) => {
            return currentAlien.y > lohestAlien.y
            ? currentAlien
            : lohestAlien;
        });
    };
};

// Selecting aliens anda generating bullets
const aliensBullets = () => {
    let lowestAlienPerCol = []
    let aliensQuantity = 0;
    for (let col = 1; col <= Aliens_Cols; col++){
        let aliensPerCol = []
        let number = 0;
        aliens.forEach((alien) => {
            if (alien.col == col) {
                aliensPerCol.push(alien);
                number++;
            }
        });
        
        if (number > 0){
            let lowestAlien = (aliensPerCol.reduce((lowestAlien, currentAlien) => {
                return currentAlien.y > lowestAlien.y
                ? currentAlien
                : lowestAlien;
            }));

            lowestAlienPerCol.push(lowestAlien);
            aliensQuantity++;
        }
    }

    for (let shots = 0; shots < 2; shots++) {
        let alienShot = lowestAlienPerCol.at(Math.floor(Math.random() * ((aliensQuantity - 1) - 0)) + 0)
        alienShot.shot({createBullet, x: alienShot.x, y: alienShot.y, id: 0});
    }
    
}

//Win game
const winGame = () => {
    window.location.replace('file:///C:/Users/gabri/Desktop/Facens/2021S6/3.0_Projeto_Aplicado_VI/P.A-VI/Pages/Game_Page/End_Game/win.html');
    game = false;
    return;
}

//Lose game
const loseGame = () => {
    window.location.replace('file:///C:/Users/gabri/Desktop/Facens/2021S6/3.0_Projeto_Aplicado_VI/P.A-VI/Pages/Game_Page/End_Game/lose.html');
    game = false;
    return;
}


// Updating the ship and bullet position
let alienCanShot = true
const update = () => {
    if (keys.right && ship.x < 96){
        ship.moveRight();
    }
    else if (keys.left && ship.x > 0){
        ship.moveLeft();
    }

    if (keys.space){
        // Create a bullet
        ship.shot({createBullet, x: ship.x, y: ship.y, id: 1});
    }

    // For each bullet, remove the element when exceeds the limits
    bullets.forEach((bullet) => {
        bullet.update();
    
        if (bullet.y < 3 || bullet.y > 43) {
            bullet.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });

    // For each alien, if alien collide to the wall, change its direction
    aliens.forEach((alien) => {
        alien.update();

        // Set lose if alien y
        if (alien.y >= 40) {
            game = false;
            loseGame();
        }
    });

    const closestAlienLeft = getClosestAlien('left');
    const closestAlienRight = getClosestAlien('right');
    
    if(closestAlienLeft.x < 0){ 
        aliens.forEach((alien) => {
            alien.moveRight();
            alien.moveDown();
        }) 
    }

    if(closestAlienRight.x > 96){
        aliens.forEach((alien) => {
            alien.moveLeft();
            alien.moveDown();
        }) 
    }

    if(alienCanShot){
        alienCanShot = false;
        aliensBullets();
        setTimeout( () => {
            alienCanShot = true;
        }, 2000);
    }
};

if(game){
    setInterval(update, 0.2);
}