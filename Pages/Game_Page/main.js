// Creating the Entity class

class Entity {

    constructor( { tag = 'div', className = '' } = {} ) {
        this.el = document.createElement();
        this.tag = 'div';
        document.body.appendChild(this.el);
        this.el.className = className;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.el.style.left = `${this.x}px`;
        this.el.style.top = `${this.y}px`;
    }

    removeEntity(){
        this.el.remove();
        this.el = null;
    }
}

// Creating a class to control the Lives

class Lives extends Entity {

    constructor() {
        super();
        this.lives = 3;
        this.setPosition(window.innerWidth / 2, window.innerHeight - 20);
        this.loadText();
    }

    removeLife(){
        this.lives = this.lives - 1;
        this.loadText();
    }

    loadText() {
        this.el.innerText = this.lives;
    }
}

// Creating a class to control the Scores

class Score extends Entity{

    constructor(){
        super();
        this.score = 0;
        this.setPosition(window.innerWidth / 2, 20);
        this.loadText();
    }

    addScore(amount) {
        this.score = this.score + amount;
        this.loadText();
    }

    loadText(){
        this.el.innerText = `Score: ${this.score}`;
    }
}

// Creating the Bullets class

class Bullet extends Entity {
    constructor(x, y, isAlien) {
        this.speed = 3;
        this.isAlien = isAlien;

        this.setPosition(x, y);
    }

    update() {
        const bullet_y = this.isAlien ? this.speed : -this.speed;
        this.setPosition(this.x, this.y + bullet_y);
    }
}

// Creating the Aliens class

class Alien extends Entity {

    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.score = 0;
    }

    setImage(type){
        if(type == 1){
            this.el.src = '../../Assets/Game/enemy1.png';
        }
        else if(type == 2){
            this.el.src = '../../Assets/Game/enemy2.png';
        }
        else if(type == 3){
            this.el.src = '../../Assets/Game/enemy3.png';
        }
        else{
            this.el.src = '../../Assets/Game/enemy4.png';
        }
    }
}


class Ship {
    constructor(removeLife, getOverlappingBullet, removeBullet, type) {
        this.type = type;
        this.el.src = '../../Assets/Game/ship.png';
        document.body.appendChild(this.el);

        this.spped = 2;
        this.image_width = 50;
        this.canFire = true;
        this.isAlive = true;

        this.removeLife = removeLife;
        this.getOverlappingBullet = getOverlappingBullet;
        this.removeBullet = removeBullet;

        this.spawn();
    }

    setColor(type){
        if(type == 1){
            this.color = 'red';
        }
        else{
            this.color = 'blue';
        }

    }

    spawn(){
        this.isAlive = true;
        this.el.style.opacity = 1;
        this.setPosition(window.innerWidth / 2, window.innerHeight - 80);
    }

    moveRight() {
        if (this.isAlive == true){
            this.setPosition(this.x + this.speed, this.y);
        }
        else{
            return;
        }
    }

    moveLeft() {
        if (this.isAlive == true){
            this.setPosition(this.x - this.speed, this.y);
        }
        else{
            return;
        }
    }

    fire(createBullet) {
        if(this.canFire && this.isAlive) {
            this.canFire = false;
            createBullet(this.x + this.image_width / 2, this.y);
        }

        setTimeout( () => {
            this.canFire = true;
        }, 1000)
    }

    kill () {
        this.isAlive = false;

        setTimeout( () => {
            this.spawn();
        }, 3000);

        this.el.style.opacity = 0;
    }

    update() {
        const bullet = this.getOverlappingBullet(this);
        if(bullet && bullet.isAlien && this.isAlive) {
            this.removeBullet(bullet);
            this.removeLife();
            this.kill();
        }
    }
}

