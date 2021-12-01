export default function createGame() {
    const state = {
        players: {}
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

    function addPlayer(command){
        const playerId = command.playerId

        state.players[playerId] = {
            id: playerId
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId
        })
    }

    function removePlayer(command){
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function movePlayer(command){
        notifyAll(command)

        const acceptedMoves = {
            ArrowRight(player) {
                
            },
            ArrowLeft(player) {

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

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        state,
        setState,
        subscribe
    }
}