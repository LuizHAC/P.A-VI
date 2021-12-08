export default function createKeyboardListener(document){
    const state = {
        observers: [],
        playerId: null
    }

    const keys = {
        right: false,
        left: false,
        space:false
    }

    function registerPlayerId(playerId){
        state.playerId = playerId
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        for (const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)

    function handleKeydown(event){
        const keyPressed = event.key

        if (keyPressed === 'ArrowRight') {
            keys.right = true;
        } else if (keyPressed === 'ArrowLeft') {
            keys.left = true;
        } else if (keyPressed === ' ') {
            keys.space = true;
        } else {
            const command = {
                type: 'move-player',
                playerId: state.playerId,
                keyPressed
            }
    
            notifyAll(command)
        }
    }

    function handleKeyup(event){
        const keyPressed = event.key

        if (keyPressed === 'ArrowRight') {
            keys.right = false;
        } else if (keyPressed === 'ArrowLeft') {
            keys.left = false;
        } else if (keyPressed === ' ') {
            keys.space = false;
        }
    }

    function update(){
        if (keys.right){
            const command = {
                type: 'move-player',
                playerId: state.playerId,
                keyPressed: 'ArrowRight'
            }
    
            notifyAll(command)
        }
        else if (keys.left){
            const command = {
                type: 'move-player',
                playerId: state.playerId,
                keyPressed: 'ArrowLeft'
            }

            notifyAll(command)
        }
        if (keys.space){
            const command = {
                type: 'move-player',
                playerId: state.playerId,
                keyPressed: ' '
            }

            notifyAll(command)
        }
    }

    setInterval(update, 0.2);

    return {
        subscribe,
        registerPlayerId
    }
}