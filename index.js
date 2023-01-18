import Game from "./Game.js";
import MCTS from "./MCTS.js";
import Chords from "./modules/Chords.js";
import Play from "./modules/Play.js";

let game = new Game()
let mcts = new MCTS(game)

let initialState = game.start()

console.log(game.nextState(initialState, new Play(new Chords.From4D(1, 1, 1, 1), initialState.player)))