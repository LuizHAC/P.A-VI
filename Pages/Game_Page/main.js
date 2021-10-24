// Creating the Entity class
class Entity {
    constructor({ tag = 'div', className = '' } = {}) {
      this.el = document.createElement(tag);
      document.body.appendChild(this.el);
      this.el.className = 'entity ' + className;
      this.el.style.position = 'absolute';
    }
  
    setPosition(x, y){
        this.x = x;
        this.y = y;

        this.el.style.left = `${this.x}px`
        this.el.style.position = 'absolute';
        this.el.style.top = `${this.y}px`;
    }
  
    remove() {
      this.el.remove();
      this.el = null;
    }
  }

  // Creating the ship class
class Ship  extends Entity{
    constructor() {
        super({className: 'ship', tag: 'img'});
        this.el.src = '../../Assets/Game/ship.png';

        this.speed = 5;
        this.canShot = true;
        this.el.className = 'ship';
        this.setPosition(window.innerWidth / 2, window.innerHeight - 120)
    }

    moveRight(){
        this.setPosition(this.x + this.speed, this.y);
    }

    moveLeft(){
        this.setPosition(this.x - this.speed, this.y);
    }

    shot({createBullet}){
        
        if(this.canShot){
            this.canShot = false;
            createBullet({x: this.x + 43.5, y: this.y - 20});
            setTimeout( () => {
                this.canShot = true;
            }, 500);
        }

    }
}

class Bullet extends Entity{
    constructor({x, y}){
        super({className: 'bullet'});

        this.speed = 5;
        this.el.className = 'bullet';
        this.el.style.backgroundColor = 'white';
        this.el.style.width = `${5}px`;
        this.el.style.height = `${15}px`;

        this.setPosition(x, y);
    }

    update(){
        this.setPosition(this.x, this.y - this.speed);
    }
}

class Alien extends Entity{
    constructor({x, y, type}){
        super({tag: 'img'});
        this.setImage(type);
        this.speed = 3;
        

        this.setPosition(x, y);
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
        else if(type == 4){
            this.el.src = '../../Assets/Game/enemy4.png';
        }
    }

    update(){
        this.setPosition(this.x, this.y - this.speed);
    }
}

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

const ship = new Ship();
const bullets = [];
const aliens = [];

const Aliens_Rows = 4;
const Aliens_Cols = 9;

for (let row = 0 ; row <= Aliens_Rows; row++){
    for (let col = 0; col <= Aliens_Cols; col++){
        const alien = new Alien({x: col * 150 + 250, y:row * 100 + 10, type:row});
        aliens.push(alien);
    }
}

const createBullet = ({x, y}) => {
    bullets.push(new Bullet({x: ship.x + 43.5, y: ship.y - 20}));
}

const update = () => {
    if (keys.right && ship.x < window.innerWidth - 100){
        ship.moveRight();
    }
    else if (keys.left && ship.x > 0){
        ship.moveLeft();
    }

    if (keys.space){
        // Create a bullet
        ship.shot({createBullet})
    }

    bullets.forEach(bullet => bullet.update());
}

setInterval(update, 0.2);