import GameState from "./GameState.js";
import Board from "./modules/Board.js";
import Chords from "./modules/Chords.js";
import Play from "./modules/Play.js";
import Player from "./modules/Player.js";
import Utils from "./modules/Utils.js";

export default class Game {
    /**
     * Get a new empty GameState
     * @returns {GameState} The initial GameState
     */
    start() {
        return new GameState([], new Board(), Utils.chordsToNum(new Chords.From2D(1, 1)), Player.CROSS)
    }

    /**
     * Method to get the legal plays of a GameState
     * @param {GameState} state The GameState the legal plays should be calculated from
     * @returns {Play[]} Array containing legal plays
     */
    legalPlays(state) {
        let board = state.board
        let legalPlays = []
        for(let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        if(board.getField()[row][col][fieldRow][fieldCol] == Player.DEFAULT
                                // check whether field is locked
                                && !board.getLocked()[row][col].locked
                                // check whether the play is in the forced field
                                && (state.next == Utils.chordsToNum(new Chords.From2D(row, col)) || state.next === undefined)) {
                            legalPlays.push(new Play(new Chords.From4D(row, col, fieldRow, fieldCol), state.player))
                        }
                    }
                }
            }
        }
        return legalPlays
    }

    /**
     * Checks whether the play would be legal for the current state
     * @param {GameState} state 
     * @param {Play} play 
     * @returns {Boolean}
     */
    isLegalPlay(state, play) {
        return (this.legalPlays(state).find(value => value.hash() == play.hash()) !== undefined)
    }

    /**
     * Calculates the next state from a state and a play
     * @param {GameState} state The old state
     * @param {Play} play The play
     * @returns {GameState} The new state
     */
    nextState(state, play) {
        //if(!this.isLegalPlay(state, play)) throw new Error("Illegal play")

        let newHistory = state.history.splice()
        newHistory.push(play)

        let newBoard = state.board
        newBoard.set(play.chords, play.player)
        let winnerInField = Utils.checkField(newBoard.getField()[play.chords.row][play.chords.col], Player.DEFAULT)
        if(winnerInField !== false) {
            newBoard.setLocked(new Chords.From2D(play.chords.row, play.chords.col), true, winnerInField)
        }

        let newNext = Utils.chordsToNum(new Chords.From2D(play.fieldRow, play.fieldCol))

        // free choice if next field is either locked
        if(newBoard.getLocked()[play.fieldRow][play.fieldCol].locked
        // or full
                || Utils.isFull(state, new Chords.From2D(play.fieldRow, play.fieldCol))) {
            newNext = undefined
        }

        let newPlayer = (state.player == Player.CROSS ? Player.CIRCLE : Player.CROSS)

        return new GameState(newHistory, newBoard, newNext, newPlayer)
    }

    /**
     * Calculates the winner of a given state
     * @param {GameState} state 
     * @returns {Number} The constant of the winner, see {@link Player}
     */
    winner(state) {
        // array of the lockItems of the global field, basically a normal tictactoe field
        let array = []
        let winner = false
        for(let row = 0; row <= 2; row++) {
            array[row] = []
            for(let col = 0; col <= 2; col++) {
                array[row][col] = state.board.getLocked()[row][col].lockItem
            }
        }
        
        winner = Utils.checkField(array, Player.DEFAULT)
        
        if(Utils.isFullGlobal(state)) {
            winner = Player.DEFAULT
        }

        return winner
    }

    getFieldVisual(state) {
        // TODO check winner doesnt works
        let board = state.board
        let msg = ""
        for(let row = 0; row <= 2; row++) {
            for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                for(let col = 0; col <= 2; col++) {
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        msg+=board.getField()[row][col][fieldRow][fieldCol] + " "
                    }
                    msg+=" "
                }
                msg+="\n"
            }
            msg = msg + board.getLocked()[row][0].locked + board.getLocked()[row][1].locked + board.getLocked()[row][2].locked + "\n"
        }
        msg+="-----------------------"
        return msg
    }
}