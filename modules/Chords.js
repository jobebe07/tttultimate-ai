export default class Chords {
    static From2D = class {
        constructor(row, col) {
            this.row = row
            this.col = col
            this.type = Chords.Type.FROM_2D
        }
    }

    static From4D = class {
        constructor(row, col, fieldRow, fieldCol) {
            this.row = row
            this.col = col
            this.fieldRow = fieldRow
            this.fieldCol = fieldCol
            this.type = Chords.Type.FROM_4D
        }
    }

    static Type = {
        FROM_2D: 0,
        FROM_4D: 1,
    }
}