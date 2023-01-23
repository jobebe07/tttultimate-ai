import Game from "./Game.js";
import MCTS from "./MCTS.js";
import Chords from "./modules/Chords.js";
import Play from "./modules/Play.js";

let game = new Game()
let mcts = new MCTS(game)

let initialState = game.start()

mcts.makeNode(initialState)
let node = mcts.nodes.get(initialState.hash())
console.log(node)
console.log(mcts.simulate(node))
console.log(node)

console.log(mcts.select(initialState))

//console.log(mcts.simulate(node))