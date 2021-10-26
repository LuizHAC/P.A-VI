// Creating the Entity class
class Entity {
    constructor({ tag = 'div', className = '' } = {}) {
      this.el = document.createElement(tag);
      this.el.className = 'entity ' + className;
      this.el.style.position = 'absolute';
      document.body.appendChild(this.el);
    }
    
    // Set the position from a given x, y
    setPosition(x, y){
        this.x = x;
        this.y = y;

        this.el.style.left = `${this.x}px`
        this.el.style.position = 'absolute';
        this.el.style.top = `${this.y}px`;
    }
    
    // Remove this element
    remove() {
      this.el.remove();
      this.el = null;
    }
  }

  // Creating the ship class and inheriting from the Entity class to set class name, positions, creat elements and setPosition
class Ship  extends Entity{
    constructor() {
        super({className: 'ship', tag: 'img'});
        this.el.src = '../../Assets/Game/ship.png';

        this.speed = 5;
        this.canShot = true;
        this.el.className = 'ship';
        this.setPosition(window.innerWidth / 2, window.innerHeight - 120)
    }

    // Move the ship to the right and to the left
    moveRight(){
        this.setPosition(this.x + this.speed, this.y);
    }

    moveLeft(){
        this.setPosition(this.x - this.speed, this.y);
    }

    // Creating a function to shot and to apply a cooldown between the consecutive shots
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

// Creating the Bullet class
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

// Creating the Alien class
class Alien extends Entity{
    constructor({x, y, type}){
        super({tag: 'img'});
        this.setImage(type);
        this.direction = 'left';
        this.speed = 1.0;
        this.setPosition(x, y);
    }

    // Setting the alien image using it's row
    setImage(type){
        if(type == 1){
            this.el.src = '../../Assets/Game/enemy1.png';
        }
        else if(type == 2){
            this.el.src = '../../Assets/Game/enemy2.png';
            this.el.style.filter = 'invert(100%) sepia(31%) saturate(4000%) hue-rotate(54deg) brightness(100%) contrast(82%)';
        }
        else if(type == 3){
            this.el.src = '../../Assets/Game/enemy3.png';
            this.el.style.filter = 'invert(82%) sepia(47%) saturate(566%) hue-rotate(9deg) brightness(97%) contrast(84%)';
        }
        else if(type == 4){
            this.el.src = '../../Assets/Game/enemy4.png';
            this.el.style.filter = 'invert(44%) sepia(58%) saturate(3969%) hue-rotate(246deg) brightness(86%) contrast(91%)';
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

const ship = new Ship();
const bullets = [];
const aliens = [];

const Aliens_Rows = 4;
const Aliens_Cols = 9;

// Creating the enemies
for (let row = 0 ; row <= Aliens_Rows; row++){
    for (let col = 0; col <= Aliens_Cols; col++){
        const alien = new Alien({x: col * 150 + 250, y:row * 100 + 10, type:row});
        aliens.push(alien);
    }
}

// Creating a bullet
const createBullet = ({x, y}) => {
    bullets.push(new Bullet({x: ship.x + 43.5, y: ship.y - 20}));
}

// Removing the bullet element (so we don't have infinite bullet elements)
const removeBullet = (bullet) => {
    bullets.splice(bullets.indexOf(bullet), 1);
    bullet.remove();
};

// Catch the aliens closest to crashing into the wall
const getClosestAlien = (direction) => {

    if(direction === 'left'){
        return aliens.reduce((minimumAlien, currentAlien) => {
            return currentAlien.x < minimumAlien.x
              ? currentAlien
              : minimumAlien;
          });
    }
    if(direction === 'right'){
        return aliens.reduce((maximumAlien, currentAlien) => {
            return currentAlien.x > maximumAlien.x
            ? currentAlien
            : maximumAlien;
        });
    
  };
};

// Updating the ship and bullet position
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

    // For each bullet, if y <0, remove this element
    bullets.forEach((bullet) => {
        bullet.update();
    
        if (bullet.y < 0) {
          bullet.remove();
          bullets.splice(bullets.indexOf(bullet), 1);
        }
      });

      // For each alien, if alien collide to the wall, change its direction
      aliens.forEach((alien) => {
            alien.update();
      })

      const closestAlienLeft = getClosestAlien('left');
      const closestAlienRight = getClosestAlien('right');

        if(closestAlienLeft.x < 30){ 
            aliens.forEach((alien) => {
                alien.moveRight();
                alien.moveDown();
            }) 
        }

        if(closestAlienRight.x > window.innerWidth - 120){
            aliens.forEach((alien) => {
                alien.moveLeft();
                alien.moveDown();
            }) 
        }

};

setInterval(update, 0.2);