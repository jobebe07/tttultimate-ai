import Chords from "./Chords.js";
import Player from "./Player.js"

export default class Board {
    #field
    #locked
    constructor() {
        this.#field = []
        this.#locked = []

        for(let row = 0; row <= 2; row++) {
            this.#field[row] = []

            for (let col = 0; col <= 2; col++) {
                this.#field[row][col] = []

                for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                    this.#field[row][col][fieldRow] = []

                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        this.#field[row][col][fieldRow][fieldCol] = Player.DEFAULT
                    }
                }
            }
        }

        for(let row = 0; row <= 2; row++) {
            this.#locked[row] = []
            for (let col = 0; col <= 2; col++) {
                this.#locked[row][col] = {locked: false, lockItem: Player.DEFAULT}
            }
        }
    }

    getField() {
        return this.#field
    }

    getLocked() {
        return this.#locked
    }

    set(chords, player = Player.DEFAULT) {
        if(chords.type !== Chords.Type.FROM_4D) throw new Error("Invalid chords")

        this.#field[chords.row][chords.col][chords.fieldRow][chords.fieldCol] = player
    }

    setLocked(chords, locked, player = Player.DEFAULT) {
        if(chords.type !== Chords.Type.FROM_2D) throw new Error("Invalid chords")

        this.#locked[chords.row][chords.col].locked = locked
        this.#locked[chords.row][chords.col].lockItem = player
    }
}