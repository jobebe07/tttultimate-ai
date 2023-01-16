import Chords from "./Chords.js"

export default class Utils {
    static numToChords(num) {
        num--
        let col = (num % 3)
        let row = Math.floor(num / 3)
        return new Chords.From2D(row, col)
    }

    static chordsToNum(chords) {
        return ((chords.row+1)*3) - (3-(chords.col+1))
    }

    static isFull(state, chords) {
        if(chords.type !== Chords.Type.FROM_2D) throw new Error("Invalid chords")

        let notFull = false
        for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
            for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                if(state.getBoard()[chords.row][chords.col][fieldRow][fieldCol] === Player.DEFAULT) {
                    notFull = true
                }
            }
        }

        return !notFull
    }

    static isFullGlobal(state) {
        let notFull = false

        for(let row = 0; row <= 2; row++) {
            for(let col = 0; col <= 2; col++) {
                if(!state.getLocked()[row][col].locked && !this.isFull(state, row, col)) {
                    notFull = true
                }
            }
        }

        return !notFull
    }

    static checkField(array, ex) {
        try {
            if(array[0][0] === array[0][1] && array[0][0] === array[0][2] && array[0][0] !== ex) {
                return array[0][0]
            }
            if(array[1][0] === array[1][1] && array[1][0] === array[1][2] && array[1][0] !== ex) {
                return array[1][0]
            }
            if(array[2][0] === array[2][1] && array[2][0] === array[2][2] && array[2][0] !== ex) {
                return array[2][0]
            }

            if(array[0][0] === array[1][0] && array[0][0] === array[2][0] && array[0][0] !== ex) {
                return array[0][0]
            }
            if(array[0][1] === array[1][1] && array[0][1] === array[2][1] && array[0][1] !== ex) {
                return array[0][1]
            }
            if(array[0][2] === array[1][2] && array[0][2] === array[2][2] && array[0][2] !== ex) {
                return array[0][2]
            }

            if(array[0][0] === array[1][1] && array[0][0] === array[2][2] && array[0][0] !== ex) {
                return array[0][0]
            }
            if(array[0][2] === array[1][1] && array[0][2] === array[2][0] && array[0][2] !== ex) {
                return array[0][2]
            }
        } catch (ex) {

        }
        return false
    }
}