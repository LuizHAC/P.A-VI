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
