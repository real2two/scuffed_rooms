function setup() {
    createCanvas(500, 500);
}

function draw() {
    if (ws === null) return clear();

    background(220);

    push();
    translateToMiddle();
    square(0, 0, boxSize);
    pop();

    for (const { u, x, y } of otherPlayers) {
        push();
        
        translateToMiddle(x, y);
        translate(x, y);

        textAlign(CENTER);
        text(u, 12.5, -5);

        fill("gray");
        square(0, 0, boxSize);
        pop();
    }
}

function translateToMiddle() {
    translate(250 - player.x, 250 - player.y);
    translate(boxSize / 2, boxSize / 2);
}