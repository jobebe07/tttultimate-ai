import Player from "./modules/Player.js";

export default class GameState {
    constructor(history, board, next, player = Player.CROSS) {
        this.history = history
        this.board = board
        this.next = next
        this.player = player
    }

    hash() {
        return JSON.stringify(this.history)
    }

    clone() {
        return new GameState(this.history, this.board, this.next, this.player)
    }
}