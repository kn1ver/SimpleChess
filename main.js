const board = Array.from({ length: 8 }, () => Array(8).fill(null));
let whiteTakenPieces = []
let blackTakenPieces = []
let circle_
let selectedPiece;
let newSelectedPiece;
const NS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("svg");
const cellHighlight = document.createElementNS(NS, "rect")

cellHighlight.setAttribute("width", 19);
cellHighlight.setAttribute("height", 19);

cellHighlight.setAttribute("fill", "none");
cellHighlight.setAttribute("stroke", "white");
cellHighlight.setAttribute("stroke-width", "1");

function drawBoard() {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const rect = document.createElementNS(NS, "rect");

            if (((x % 2 === 0) + (y % 2 === 0)) === 1) {
                rect.setAttribute("fill", "#b53b33")
            } else {
                rect.setAttribute("fill", "#ffdede")
            }

            rect.setAttribute("x", x * 20);
            rect.setAttribute("y", y * 20);
            rect.setAttribute("width", 20);
            rect.setAttribute("height", 20);

            rect.dataset.row = y
            rect.dataset.col = x

            svg.appendChild(rect);
        }
    }
}
function drawPieces(pieces) {
    for (let piece of pieces.values()) {
        if (piece.onBoard) {
            piece.drawPiece()
        } else {
            piece.drawPiece(piece.coord.x, piece.coord.y, 0.5)
        }
    }
}
function path(d, extra = {}) {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    for (const k in extra) p.setAttribute(k, extra[k]);
    return p;
}
function circle(cx, cy, r) {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", r);
    return c;
}

class Piece {
    svg = undefined;
    team = undefined;
    name = undefined;
    group = undefined;
    onBoard = true;

    coord = { x: 0, y: 0 };
    row = 1;
    col = 1;

    constructor(svg, coord = { x: 0, y: 0 }, team = "Black", name = "kingBlack") {
        this.coord = coord;
        this.team = team;
        this.name = name;
        this.svg = svg;
        this.row = coord.y / 20;
        this.col = coord.x / 20;

        board[this.col][this.row] = this;
    }

    moveTo(newX = 0, newY = 0) {

        console.log(`Двигаем ${this.name} на`, newX / 20, newY / 20)

        board[newX / 20][newY / 20] = this
        board[this.coord.x / 20][this.coord.y / 20] = undefined

        this.coord = { x: newX, y: newY }
        this.row = newY / 20;
        this.col = newX / 20;
        this.group.dataset.col = newX / 20
        this.group.dataset.row = newY / 20

        drawPieces(pieces)
    }
    attack(newCol, newRow) {
        let otherPiece = board[newCol][newRow] || undefined;
        console.log(`${this.name} ест ${otherPiece.name}`)
        otherPiece.die()
        this.moveTo(newCol * 20, newRow * 20)
    }
    die() {
        if (this.team === "White") {
            if (whiteTakenPieces[0]) {
                if (whiteTakenPieces.length < 8) {
                    this.coord.x = 160
                    this.coord.y = whiteTakenPieces.at(-1).coord.y + 10
                } else if (whiteTakenPieces.length === 8) {
                    this.coord.x = 170
                    this.coord.y = 0
                } else {
                    this.coord.x = 170
                    this.coord.y = whiteTakenPieces.at(-1).coord.y + 10
                }
            } else {
                this.coord.x = 160
                this.coord.y = 0
            }
            whiteTakenPieces.push(this)
        } else {
            if (blackTakenPieces[0]) {
                if (blackTakenPieces.length < 8) {
                    this.coord.x = 160
                    this.coord.y = blackTakenPieces.at(-1).coord.y - 10
                } else if (blackTakenPieces.length === 8) {
                    this.coord.x = 170
                    this.coord.y = 150
                } else {
                    this.coord.x = 170
                    this.coord.y = blackTakenPieces.at(-1).coord.y - 10
                }
            } else {
                this.coord.x = 160
                this.coord.y = 150
            }
            blackTakenPieces.push(this)
        }
        this.col = undefined
        this.row = undefined
        this.onBoard = false
    }
}
class Queen extends Piece {
    drawPiece(x = this.coord.x, y = this.coord.y, scale = 1) {
        let group = this.group || document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        // основание
        group.appendChild(path(`
            M4 16 
            L16 16 
            L14.5 18 
            L5.5 18 
            Z
        `));

        // тело
        group.appendChild(path(`
            M6 16
            C6.5 13, 8 9.5, 10 9.5
            C12 9.5, 13.5 13, 14 16
            Z
        `));

        // корона
        group.appendChild(path(`
            M6 9.5
            L7.5 5.5
            L10 8
            L12.5 5.5
            L14 9.5
            Z
        `));

        // шарики
        group.appendChild(path(`M7.5 5.2 A0.8 0.8 0 1 1 7.49 5.2`));
        group.appendChild(path(`M10 4.2 A1 1 0 1 1 9.99 4.2`));
        group.appendChild(path(`M12.5 5.2 A0.8 0.8 0 1 1 12.49 5.2`));

        if (this.team === "White") {
            group.setAttribute("fill", "#ddd");
            group.setAttribute("stroke", "#555");
        } else {
            group.setAttribute("fill", "#272727");
            group.setAttribute("stroke", "#505050");
        }
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        group.dataset.row = this.row;
        group.dataset.col = this.col;

        svg.appendChild(group);
        this.group = group;
        return group;
    }
}
class Pawn extends Piece {
    firstMove = true
    moveTo(newX = 0, newY = 0) {
        super.moveTo(newX, newY)
        this.firstMove = false
    }
    drawPiece(x = this.coord.x, y = this.coord.y, scale = 1) {
        let group = this.group || document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        group.appendChild(circle(10, 6, 2.2));

        group.appendChild(path(`
        M7 16
        C7.5 12, 8.5 9, 10 9
        C11.5 9, 12.5 12, 13 16
        Z
        `));

        group.appendChild(path(`M6 16 L14 16 L13 18 L7 18 Z`));

        if (this.team === "White") {
            group.setAttribute("fill", "#ddd");
            group.setAttribute("stroke", "#555");
        } else {
            group.setAttribute("fill", "#272727");
            group.setAttribute("stroke", "#505050");
        }
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        group.dataset.row = this.row;
        group.dataset.col = this.col;

        svg.appendChild(group);
        this.group = group;
        return group;
    }
    availableMoves() {
        let moves = []
        if (this.team === "White") {
            // ход вперед (вверх)
            if (!board[this.col][this.row - 1]) {
                moves.push([this.col, this.row - 1])
            }
            // двойной первый ход
            if (!board[this.col][this.row - 2] && !board[this.col][this.row - 1] && this.firstMove) {
                moves.push([this.col, this.row - 2])
            }
            // ход по диагонали (вверх-влево)
            if (this.col !== 0 && board[this.col - 1][this.row - 1] && board[this.col - 1][this.row - 1].team !== this.team) {
                moves.push([this.col - 1, this.row - 1])
            }
            // ход по диагонали (вверх-вправо)
            if (this.col !== 7 && board[this.col + 1][this.row - 1] && board[this.col + 1][this.row - 1].team !== this.team) {
                moves.push([this.col + 1, this.row - 1])
            }
        } else {
            // ход вперед (вниз)
            if (!board[this.col][this.row + 1]) {
                moves.push([this.col, this.row + 1])
            }
            // двойной первый ход
            if (!board[this.col][this.row + 2] && !board[this.col][this.row + 1] && this.firstMove) {
                moves.push([this.col, this.row + 2])
            }
            // ход по диагонали (вниз-вправо)
            if (this.col !== 7 && board[this.col + 1][this.row + 1] && board[this.col + 1][this.row + 1].team !== this.team) {
                moves.push([this.col + 1, this.row + 1])
            }
            // ход по диагонали (вниз-влево)
            if (this.col !== 0 && board[this.col - 1][this.row + 1] && board[this.col - 1][this.row + 1].team !== this.team) {
                moves.push([this.col - 1, this.row + 1])
            }
        }
        return moves
    }
    drawMoves(moves) {
        let circle_;
        if (!moves[0]) {
            console.log("Нет ходов для отрисовки");
            circle_ = undefined;
        } else {
            circle_ = document.createElementNS(NS, "g")
            for (let move of moves) {
                let part = document.createElementNS(NS, "g")

                part.appendChild(circle(move[0] * 20 + 10, move[1] * 20 + 10, 3))
                part.setAttribute("fill", "#8484847d")

                part.dataset.row = move[1]
                part.dataset.col = move[0]

                circle_.appendChild(part)
            }
            svg.appendChild(circle_)
        }
        return circle_
    }
}
class Rook extends Piece {
    drawPiece(x = this.coord.x, y = this.coord.y, scale = 1) {
        let group = this.group || document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        group.appendChild(path(`
        M5 6
        L7 6
        L7 4
        L9 4
        L9 6
        L11 6
        L11 4
        L13 4
        L13 6
        L15 6
        L15 8
        L5 8
        Z
    `));

        group.appendChild(path(`
        M6 8
        L14 8
        C13 12, 13 14, 14 16
        L6 16
        C7 14, 7 12, 6 8
        Z
    `));

        group.appendChild(path(`M5 16 L15 16 L13.5 18 L6.5 18 Z`));

        if (this.team === "White") {
            group.setAttribute("fill", "#ddd");
            group.setAttribute("stroke", "#555");
        } else {
            group.setAttribute("fill", "#272727");
            group.setAttribute("stroke", "#505050");
        }
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        group.dataset.row = this.row;
        group.dataset.col = this.col;

        svg.appendChild(group);
        this.group = group;
        return group;
    }
}
class Knight extends Piece {
    drawPiece(x = this.coord.x, y = this.coord.y, scale = 1) {
        let group = this.group || document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        group.appendChild(path(`
        M6 16
        C6 13, 7 10, 9 9
        C8 7, 9 5, 11 5
        C13 5, 14 7, 13 9
        C14 10, 14 12, 13 14
        C12 15, 10 16, 6 16
        Z
        `));

        group.appendChild(path(`M6 16 L14 16 L13 18 L7 18 Z`));

        if (this.team === "White") {
            group.setAttribute("fill", "#ddd");
            group.setAttribute("stroke", "#555");
        } else {
            group.setAttribute("fill", "#272727");
            group.setAttribute("stroke", "#505050");
        }
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        group.dataset.row = this.row;
        group.dataset.col = this.col;

        svg.appendChild(group);
        this.group = group;
        return group;
    }
}
class Bishop extends Piece {
    drawPiece(x = this.coord.x, y = this.coord.y, scale = 1) {
        let group = this.group || document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        group.appendChild(path(`
        M10 4
        C8.5 4, 8 6, 9.5 7.5
        C8 9, 8.5 12, 10 13
        C11.5 12, 12 9, 10.5 7.5
        C12 6, 11.5 4, 10 4
        Z
        `));

        group.appendChild(path(`
        M7 16
        C7.5 13, 8.5 11, 10 11
        C11.5 11, 12.5 13, 13 16
        Z
        `));

        group.appendChild(path(`M6 16 L14 16 L13 18 L7 18 Z`));

        if (this.team === "White") {
            group.setAttribute("fill", "#ddd");
            group.setAttribute("stroke", "#555");
        } else {
            group.setAttribute("fill", "#272727");
            group.setAttribute("stroke", "#505050");
        }
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        group.dataset.row = this.row;
        group.dataset.col = this.col;

        svg.appendChild(group);
        this.group = group;
        return group;
    }
}
class King extends Piece {
    drawPiece(x = this.coord.x, y = this.coord.y, scale = 1) {
        let group = this.group || document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        group.appendChild(path(`M10 3 L10 6 M8.5 4.5 L11.5 4.5`, {
            stroke: "#555",
            "stroke-width": "0.8",
            fill: "none"
        }));

        group.appendChild(path(`
        M8 6
        C8 5, 12 5, 12 6
        C12 7, 8 7, 8 6
        Z
        `));

        group.appendChild(path(`
        M7 16
        C7.5 12, 8.5 9, 10 9
        C11.5 9, 12.5 12, 13 16
        Z
        `));

        group.appendChild(path(`M6 16 L14 16 L13 18 L7 18 Z`));

        if (this.team === "White") {
            group.setAttribute("fill", "#ddd");
            group.setAttribute("stroke", "#555");
        } else {
            group.setAttribute("fill", "#272727");
            group.setAttribute("stroke", "#505050");
        }
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        group.dataset.row = this.row;
        group.dataset.col = this.col;

        this.svg.appendChild(group);
        this.group = group;
        return group;
    }
}

let pieces = new Map([
    ["queenWhite", new Queen(svg, { x: 60, y: 140 }, "White", "queenWhite")],
    ["kingWhite", new King(svg, { x: 80, y: 140 }, "White", "kingWhite")],
    ["bishopWhite1", new Bishop(svg, { x: 40, y: 140 }, "White", "bishopWhite1")],
    ["bishopWhite2", new Bishop(svg, { x: 100, y: 140 }, "White", "bishopWhite2")],
    ["knightWhite1", new Knight(svg, { x: 20, y: 140 }, "White", "knightWhite1")],
    ["knightWhite2", new Knight(svg, { x: 120, y: 140 }, "White", "knightWhite2")],
    ["rookWhite1", new Rook(svg, { x: 0, y: 140 }, "White", "rookWhite1")],
    ["rookWhite2", new Rook(svg, { x: 140, y: 140 }, "White", "rookWhite2")],

    ["queenBlack", new Queen(svg, { x: 60, y: 0 }, "Black", "queenBlack")],
    ["kingBlack", new King(svg, { x: 80, y: 0 }, "Black", "kingBlack")],
    ["bishopBlack1", new Bishop(svg, { x: 40, y: 0 }, "Black", "bishopBlack1")],
    ["bishopBlack2", new Bishop(svg, { x: 100, y: 0 }, "Black", "bishopBlack2")],
    ["knightBlack1", new Knight(svg, { x: 20, y: 0 }, "Black", "knightBlack1")],
    ["knightBlack2", new Knight(svg, { x: 120, y: 0 }, "Black", "knightBlack2")],
    ["rookBlack1", new Rook(svg, { x: 0, y: 0 }, "Black", "rookBlack1")],
    ["rookBlack2", new Rook(svg, { x: 140, y: 0 }, "Black", "rookBlack2")]
])

// Добавляем все пешки в pieces
for (let i = 1, x = 0, y = 20; i < 17; i++) {
    if (i < 9) {
        pieces.set("pawnBlack" + String(i), new Pawn(svg, { x: x, y: y }, "Black", "pawnBlack" + String(i)))
        x += 20
        y = 20
    } else if (i === 9) {
        x = 0
        y = 120
        pieces.set("pawnWhite" + String(i - 8), new Pawn(svg, { x: x, y: y }, "White", "pawnWhite" + String(i - 8)))
    } else {
        x += 20
        y = 120
        pieces.set("pawnWhite" + String(i - 8), new Pawn(svg, { x: x, y: y }, "White", "pawnWhite" + String(i - 8)))
    }
}

drawBoard()
drawPieces(pieces)

// Отслеживаем нажатие на фигуру
svg.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "rect" || (target.tagName === "path" && target.parentElement.dataset.row !== "undefined") || target.tagName === "circle") {
        const col = target.dataset.col || target.parentElement.dataset.col
        const row = target.dataset.row || target.parentElement.dataset.row
        const cell = board[col][row]

        if (!selectedPiece && !cell) { console.log(`Выбрана пустая клетка ${col} ${row}`) }

        if (selectedPiece && cell && cell.team !== selectedPiece.team) {
            console.log(`${selectedPiece.name} ест ${cell.name}`)

            selectedPiece.attack(col, row)
            selectedPiece = undefined

            svg.removeChild(circle_)
            circle_ = undefined
            cellHighlight.removeAttribute("x")
            cellHighlight.removeAttribute("y")
            return
        }

        if (cell && cell !== selectedPiece) {
            if (!cell.onBoard) { console.log("Фигура не на доске"); return }
            if (circle_) { svg.removeChild(circle_) } // удаляем отображение ходов прошлой фигуры
            selectedPiece = cell
            circle_ = selectedPiece.drawMoves(selectedPiece.availableMoves())

            cellHighlight.setAttribute("x", col * 20 + 0.5)
            cellHighlight.setAttribute("y", row * 20 + 0.5)
            svg.appendChild(cellHighlight)

            console.log(`Выбрана фигура ${selectedPiece.name} ${col} ${row}`)
            console.log("Доступные ходы:", selectedPiece.availableMoves(), selectedPiece.firstMove)
        }
        if (selectedPiece && !cell) {
            selectedPiece.moveTo(col * 20, row * 20)
            selectedPiece = undefined

            svg.removeChild(circle_)
            circle_ = undefined
            cellHighlight.removeAttribute("x")
            cellHighlight.removeAttribute("y")
        }
    }
})


