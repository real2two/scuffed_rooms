function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    if (ws === null) return clear();

    background(220);

    scalePush();
    square(0, 0, boxSize);
    pop();

    for (const { u, x, y } of otherPlayers) {
        if (u === username.value) continue;
        
        scalePush();
        translate(x, y);
        textAlign(CENTER);
        text(u, 12.5, -5);
        fill("gray");
        square(0, 0, boxSize);
        pop();
    }

    scalePush();
    translate(player.x, player.y);
    textAlign(CENTER);
    text(username.value, 12.5, -5);
    fill("gray");
    square(0, 0, boxSize);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}