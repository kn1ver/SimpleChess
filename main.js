const svg = document.getElementById("svg");
const NS = "http://www.w3.org/2000/svg";

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

            svg.appendChild(rect);
        }
    }
}
function drawFigures(figures) {
    for (let figure of figures) {
        console.log(figure)
        figure.draw()
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

class Figure {
    svg = undefined
    coord = { x: 0, y: 0 }
    team = undefined
    name = undefined
    constructor(svg, coord = { x: 0, y: 0 }, team = "Black", name = "King") {
        this.coord = coord;
        this.team = team;
        this.name = name;
        this.svg = svg
    }

    moveTo(newX = 0, newY = 0) {
        this.coord = { x: newX, y: newY }
    }
}
class Queen extends Figure {
    draw(x = this.coord.x, y = this.coord.y, scale = 1) {
        const group = document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        // стили как в SVG
        group.setAttribute("fill", "#ddd");
        group.setAttribute("stroke", "#555");
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

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

        svg.appendChild(group);
        return group;
    }
}
class Pawn extends Figure {
    draw(x = this.coord.x, y = this.coord.y, scale = 1) {
        const group = document.createElementNS(NS, "g");
        group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);

        group.appendChild(circle(10, 6, 2.2));

        group.appendChild(path(`
        M7 16
        C7.5 12, 8.5 9, 10 9
        C11.5 9, 12.5 12, 13 16
        Z
        `));

        group.appendChild(path(`M6 16 L14 16 L13 18 L7 18 Z`));

        group.setAttribute("fill", "#ddd");
        group.setAttribute("stroke", "#555");
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        svg.appendChild(group);
        return group;
    }
}
class Rook extends Figure {
    draw(x = this.coord.x, y = this.coord.y, scale = 1) {
        const group = document.createElementNS(NS, "g");
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

        group.setAttribute("fill", "#ddd");
        group.setAttribute("stroke", "#555");
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        svg.appendChild(group);
        return group;
    }
}
class Knight extends Figure {
    draw(x = this.coord.x, y = this.coord.y, scale = 1) {
        const group = document.createElementNS(NS, "g");
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

        group.setAttribute("fill", "#ddd");
        group.setAttribute("stroke", "#555");
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        svg.appendChild(group);
        return group;
    }
}
class Bishop extends Figure {
    draw(x = this.coord.x, y = this.coord.y, scale = 1) {
        const group = document.createElementNS(NS, "g");
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

        group.setAttribute("fill", "#ddd");
        group.setAttribute("stroke", "#555");
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        svg.appendChild(group);
        return group;
    }
}
class King extends Figure {
    draw(x = this.coord.x, y = this.coord.y, scale = 1) {
        const group = document.createElementNS(NS, "g");
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

        group.setAttribute("fill", "#ddd");
        group.setAttribute("stroke", "#555");
        group.setAttribute("stroke-width", "0.7");
        group.setAttribute("stroke-linejoin", "round");

        this.svg.appendChild(group);
        return group;
    }
}

drawBoard()

let figures = [
    queenWhite = new Queen(svg, { x: 60, y: 140 }, "White", "queenWhite"),
    kingWhite = new King(svg, { x: 80, y: 140 }, "White", "kingWhite"),
    bishopWhite1 = new Bishop(svg, { x: 40, y: 140 }, "White", "bishopWhite1"),
    bishopWhite2 = new Bishop(svg, { x: 100, y: 140 }, "White", "bishopWhite2"),
    knightWhite1 = new Knight(svg, { x: 20, y: 140 }, "White", "knightWhite1"),
    knightWhite2 = new Knight(svg, { x: 120, y: 140 }, "White", "knightWhite2"),
    rookWhite1 = new Rook(svg, { x: 0, y: 140 }, "White", "rookWhite1"),
    rookWhite2 = new Rook(svg, { x: 140, y: 140 }, "White", "rookWhite2"),

    queenBlack = new Queen(svg, { x: 60, y: 0 }, "Black", "queenBlack"),
    kingBlack = new King(svg, { x: 80, y: 0 }, "Black", "kingBlack"),
    bishopBlack1 = new Bishop(svg, { x: 40, y: 0 }, "Black", "bishopBlack1"),
    bishopBlack2 = new Bishop(svg, { x: 100, y: 0 }, "Black", "bishopBlack2"),
    knightBlack1 = new Knight(svg, { x: 20, y: 0 }, "Black", "knightBlack1"),
    knightBlack2 = new Knight(svg, { x: 120, y: 0 }, "Black", "knightBlack2"),
    rookBlack1 = new Rook(svg, { x: 0, y: 0 }, "Black", "rookBlack1"),
    rookBlack2 = new Rook(svg, { x: 140, y: 0 }, "Black", "rookBlack2")
]


for (let i = 1, x = 0, y = 20; i < 17; i++) {
    if (i < 9) {
        figures.push(new Pawn(svg, { x: x, y: y }, "Black", "pawnBlack" + String(i)))
        x += 20
        y = 20
    } else if (i === 9) {
        x = 0
        y = 120
        figures.push(new Pawn(svg, { x: x, y: y }, "White", "pawnWhite" + String(i - 8)))
    } else {
        x += 20
        y = 120
        figures.push(new Pawn(svg, { x: x, y: y }, "White", "pawnWhite" + String(i - 8)))
    }
}
drawFigures(figures)
console.log(figures)
