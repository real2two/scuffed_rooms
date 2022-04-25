function scalePush() {
    push();

    const cacheScale = canvasScale();

    // actualCamera shows the actual position of the camera. (without scaling.)
    const actualCamera = {
        x: (scaleWidth / 2) - (boxSize / 2),
        y: (scaleHeight / 2) - (boxSize / 2)
    }

    // scaleCamera is actualCamera, but scaled.
    const scaledCamera = {
        x: actualCamera.x * cacheScale,
        y: actualCamera.y * cacheScale
    }

    // fullCamera is the shown camera to the player.
    const fullCamera = {
        x: scaledCamera.x + ((width - (scaleWidth * cacheScale)) / 2),
        y: scaledCamera.y + ((height - (scaleHeight * cacheScale)) / 2)
    }

    // Actually translate and scaled.
    translate(fullCamera.x - (player.x * cacheScale), fullCamera.y - (player.y * cacheScale));
    scale(cacheScale);
}