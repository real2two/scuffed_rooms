const SERVER = "localhost";

const scaleWidth = 1280;
const scaleHeight = 720;
const canvasScale = () => Math.min(windowWidth / scaleWidth, windowHeight / scaleHeight);

let player = {
    x: 0,
    y: 0
}

let otherPlayers = [];

const boxSize = 25;