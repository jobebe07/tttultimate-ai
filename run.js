import Game from "./Game.js"
import MCTS from "./MCTS.js"

let game = new Game()
let mcts = new MCTS(game)
let state = game.start()
let winner = game.winner(state)// From initial state, take turns to play game until someone wins

// From initial state, play games until end

//while (!winner) {

    console.log("player: " + state.player)

    mcts.runSearch(state,  3)

    let stats = mcts.getStats(state)
    console.log("STATS: " + stats)

    let play = mcts.bestPlay(state)
    console.log("chosen play: ")
    console.log(play)
    state = game.nextState(state, play)
    winner = game.winner(state)
//}

console.log("winner: " + winner)
console.log(game.getFieldVisual(state))