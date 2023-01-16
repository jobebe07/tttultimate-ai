import Chords from "./Chords.js";

export default class Play {
    constructor(chords, player) {
        if(chords.type !== Chords.Type.FROM_4D) throw new Error("Invalid chords")

        this.chords = chords
        this.row = chords.row
        this.col = chords.col
        this.fieldRow = chords.fieldRow
        this.fieldCol = chords.fieldCol

        this.player = player
    }

    hash() {
        return this.row.toString() + "," + this.col.toString() + "," + this.fieldRow.toString() + "," + this.fieldCol.toString()
    }
}