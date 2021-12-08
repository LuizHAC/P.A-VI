export default function createGame() {
    const state = {
        players: {},
        canShot: {
            player1: true,
            player2: true
        },
        availablePlayers: [
            1,
            2
        ],
        bullets: [],
        aliens: [],
        alienDirection: "left",
        reset: false
    }

    const observers = []

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command){
        for (const observerFunction of observers){
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function setBullets(newBullets){
        state.bullets = newBullets
    }

    function setAliens(newAliens){
        state.aliens = newAliens
    }

    function addPlayer(command){
        for(const playerId in state.players){
            if(state.players[playerId].active == false)
                delete state.players[playerId]
        }

        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : 300

        if(state.availablePlayers.length == 0)
            return;

        const player = state.availablePlayers.pop();

        if(state.availablePlayers.length == 0){
            state.reset = true
            createAliens()
        }
            
        state.players[playerId] = {
            player: player,
            playerId: playerId,
            playerX: playerX,
            playerY: 0,
            active: true,
            shot: 0
        }

        notifyAll({
            type: 'add-player',
            player: player,
            playerId: playerId,
            playerX: playerX,
            playerY: 0,
            active: true,
            shot: 0
        })
    }

    function removePlayer(command){
        const playerId = command.playerId

        if(!state.players[playerId])
            return

        state.reset = true

        state.players[playerId].active = false
        state.availablePlayers.push(state.players[playerId].player)

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function movePlayer(command){
        notifyAll(command)

        const acceptedMoves = {
            ArrowRight(player) {
                player.playerX+=4;
            },
            ArrowLeft(player) {
                player.playerX-=4;
            },
            ' '(player){
                if(state.availablePlayers != 0)
                    return

                if(state.canShot[`player${player.player}`]){
                    state.canShot[`player${player.player}`] = false;
                    setTimeout( () => {
                        state.canShot[`player${player.player}`] = true;
                    }, 500);
                    createBullet({player: player.player, playerX: player.playerX, playerY: player.playerY})
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]

        const moveFunction = acceptedMoves[keyPressed]

        if(player && moveFunction){
            moveFunction(player)
        }
    }

    function updatePlayer(command){
        console.log(command)
    }

    const createBullet = ({player, playerX, playerY}) => {
        const id = state.bullets.length == 0 ? 0 : state.bullets[state.bullets.length-1].id + 1;
        state.bullets.push({id: id,x: playerX + 43.5, y: playerY - 20, player: player, active: true});
    }

    const Aliens_Rows = 4;
    const Aliens_Cols = 9;
    function createAliens(){
        state.aliens = []
        for (let row = 1 ; row <= Aliens_Rows; row++){
            for (let col = 0; col <= Aliens_Cols; col++){
                state.aliens.push({
                    id: `${row}${col}`,
                    x: col * 150 + 250,
                    y: row * 100 + 10,
                    type: row,
                    active: true
                })
            }
        }
    }

    // Catch the aliens closest to crashing into the wall
    const getClosestAlien = (direction) => {

        if(direction === 'left'){
            return state.aliens.reduce((minimumAlien, currentAlien) => {
                return currentAlien.x < minimumAlien.x
                ? currentAlien
                : minimumAlien;
            });
        }
        if(direction === 'right'){
            return state.aliens.reduce((maximumAlien, currentAlien) => {
                return currentAlien.x > maximumAlien.x
                ? currentAlien
                : maximumAlien;
            });
        
        };
    };

    const alienShot = ({alienId, playerId, bulletId}) => {
        notifyAll({
            type: 'alien-shot',
            alienId: alienId,
            playerId: playerId,
            bulletId: bulletId
        })
    }

    const receiveAlienShot = (command) => {
        if(command.type != 'alien-shot')
            return

        for(var i = 0; i<state.aliens.length-1; i++){
            if(state.aliens[i].id == command.alienId){
                state.aliens[i].active = false
            }
        }

        for(var i = 0; i<state.bullets.length; i++){
            if(state.bullets[i].id == command.bulletId){
                state.bullets[i].active = false
            }
        }
    }

    const update = () => {
        state.bullets.forEach((bullet) => {        
            bullet.y -= 0.5
        });

        notifyAll({
            type: 'update',
            state: state
        })
    };

    const velocityAliens = 2
    const updateAliens = () => {
        if(state.aliens.length > 0){
            if(state.alienDirection === 'left'){
                state.aliens.forEach((alien) => {
                    alien.x -= velocityAliens;
                })
            }
            else{
                state.aliens.forEach((alien) => {
                    alien.x += velocityAliens;
                })
            }
            
            const closestAlienLeft = getClosestAlien('left');
            const closestAlienRight = getClosestAlien('right');

            if(closestAlienLeft.x < 30){ 
                state.alienDirection = 'right'
                state.aliens.forEach((alien) => {
                    alien.y += (velocityAliens * 5)
                }) 
            }
    
            if(closestAlienRight.x > 1920 - 120){
                state.alienDirection = 'left'
                state.aliens.forEach((alien) => {
                    alien.y += (velocityAliens * 5)
                }) 
            }
        }
    }

    function startUpdate(){
        setInterval(update, 1);
        setInterval(updateAliens, 50)
    }


    return {
        addPlayer,
        removePlayer,
        movePlayer,
        state,
        setState,
        setBullets,
        setAliens,
        subscribe,
        updatePlayer,
        startUpdate,
        createAliens,
        alienShot,
        receiveAlienShot
    }
}