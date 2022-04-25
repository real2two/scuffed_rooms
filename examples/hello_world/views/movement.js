let pressing = {
    w: false,
    a: false,
    s: false,
    d: false
}

function keyPressed() {
    switch (keyCode) {
        case 87: // w
            pressing.w = true;
            break;
        case 65: // a
            pressing.a = true;
            break;
        case 83: // s
            pressing.s = true;
            break;
        case 68: // d
            pressing.d = true;
            break;
    }
}

function keyReleased() {
    switch (keyCode) {
        case 87: // w
            pressing.w = false;
            break;
        case 65: // a
            pressing.a = false;
            break;
        case 83: // s
            pressing.s = false;
            break;
        case 68: // d
            pressing.d = false;
            break;
    }
}

setInterval(() => {
    if (ws === null) return;

    if (!(pressing.w && pressing.s) && (pressing.w === true || pressing.s === true)) {
        if (pressing.w) {
            player.y -= 5;
        } else { // pressing.s
            player.y += 5;
        }
    }

    if (!(pressing.a === true && pressing.d === true) && (pressing.a === true || pressing.d === true)) {
        if (pressing.a) {
            player.x -= 5;
        } else { // pressing.d
            player.x += 5;
        }
    }

    if (ws.readyState === 1) ws.send(JSON.stringify({
        x: player.x,
        y: player.y
    }));
}, 15);