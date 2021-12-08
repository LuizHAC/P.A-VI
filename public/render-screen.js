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

    // Explosion animation
    explode(){
        this.el.src = '../../Assets/Game/explosion.png';
    }
}

// Creating the ship class and inheriting from the Entity class to set class name, positions, creat elements and setPosition
class Ship  extends Entity{
    constructor(player, playerId) {
        super({className: `ship`, tag: 'img'});
        this.playerId = playerId
        this.player = player
        this.setShip()
        this.speed = 2;
        this.canShot = true;
        this.el.className = `ship ${playerId}`;
        this.setPosition(-200, window.innerHeight - 120)
    }

    // Set the space ship color
    setShip(){
        this.el.src = '../../Assets/Game/ship.png';

        if (this.player == 1){
            this.el.style.filter = 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)';
        }

        if (this.player == 2){
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
    shot({createBullet, game, playerId}){
        if(this.canShot){
            this.canShot = false;
            createBullet({x: this.x + 43.5, y: this.y - 20}, {player: game.state.players[playerId].player, playerX: game.state.players[playerId].playerX, playerY: game.state.players[playerId].playerY});
            setTimeout( () => {
                this.canShot = true;
            }, 500);
        }

    }
}

class Alien extends Entity{
    constructor({id, x, y, type, getOverlapBullet, removeAlien, removeBullet, addScore}){
        super({tag: 'img'});
        this.id = id
        this.setImage(type);
        this.direction = 'left';
        this.speed = 1.0;
        this.setPosition(x, y);
        this.getOverlapBullet = getOverlapBullet;
        this.el.className = `alien alien${id}`;
        this.removeAlien = removeAlien;
        this.removeBullet = removeBullet;
        this.addScore = addScore;
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
        if (overlap){
            this.addScore(this.score);
            this.removeAlien(this);
            this.removeBullet(overlap);
        }
    }
}

class Bullet extends Entity{
    constructor({id, x, y, player}){
        super({className: 'bullet'});
        this.id = id
        this.speed = 2;
        this.player = player
        this.el.className = `bullet bullet${id}`;
        this.setColor()
        this.el.style.width = `${10}px`;
        this.el.style.height = `${15}px`;

        this.setPosition(x, y);
    }

    setColor(){
        if(this.player == 1){
            this.el.style.backgroundColor = 'red';
        }
        if(this.player == 2){
            this.el.style.backgroundColor = 'blue';
        }
    }

}

var bullets = [];
var aliens = [];

const createBullet = ({id, player, playerX, playerY}) => {
    bullets.push(new Bullet({id: id, x: playerX, y: playerY - 20, player: player}));
}

const createAlien = ({id, type, alienX, alienY}) => {
    aliens.push(new Alien({ id: id, x: alienX, y: alienY, type: type}))
}

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

function resetRender(){
    bullets = []
    aliens = []

    var elementsBullet = document.getElementsByClassName(`bullet`)
    var elementsAlien = document.getElementsByClassName(`alien`)

    while(elementsBullet.length > 0){
        elementsBullet[0].parentNode.removeChild(elementsBullet[0]);
    } 
    while(elementsAlien.length > 0){
        elementsAlien[0].parentNode.removeChild(elementsAlien[0]);
    } 
}

export default function renderScreen(game, requestAnimationFrame, currentPlayerId) {
    if(game.state.reset){
        game.state.reset = false
        resetRender()
    }

    for (const playerId in game.state.players) {
        if(game.state.players[playerId].active == false){
            var elements = document.getElementsByClassName(`${playerId}`);
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }        
        }

        if(!game.state.players[playerId].entity){
            game.state.players[playerId].entity = new Ship(game.state.players[playerId].player, playerId)
        } else {
            game.state.players[playerId].entity.setPosition(game.state.players[playerId].playerX, game.state.players[playerId].entity.y)
        }

        if(playerId == currentPlayerId && game.state.players[playerId].entity){
            var elements = document.getElementsByClassName(`${playerId}`);
            elements[0].style.cssText += 'z-index: 999'
        }
    }

    game.state.bullets.forEach(bullet => {
        var element = document.getElementsByClassName(`bullet${bullet.id}`)
        if(bullet.active == false){
            if(element[0])
                element[0].parentNode.removeChild(element[0])
            return;            
        }

        if(element.length > 0){
            bullets.forEach(ctx => {
                if(ctx.id == bullet.id){
                    ctx.setPosition(bullet.x, bullet.y + game.state.players[currentPlayerId].entity.y)
                }
            });
        } else if(bullet.active == true){
            createBullet({id: bullet.id, player: bullet.player, playerX: bullet.x, playerY: bullet.y + game.state.players[currentPlayerId].entity.y})
        }
    });

    game.state.aliens.forEach(alien => {
        var element = document.getElementsByClassName(`alien${alien.id}`)

        if(alien.active == false){
            if(element[0])
                element[0].parentNode.removeChild(element[0])
            return;            
        }

        if(element.length > 0){
            aliens.forEach(ctx => {
                if(ctx.id == alien.id){
                    var bullet = getOverlapBullet(ctx)
                    if(bullet){
                        game.alienShot({alienId: ctx.id, playerId: currentPlayerId, bulletId: bullet.id})
                    }
                    ctx.setPosition(alien.x, alien.y)
                }
            })
        } else {
            createAlien({id: alien.id, x: alien.x, y: alien.y, type: alien.type})
        }
    })

    requestAnimationFrame(() => {
        renderScreen(game, requestAnimationFrame, currentPlayerId)
    })    
}
