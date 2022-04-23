const {
    ws: {
        idleTimeout = 60,
        maxBackpressure = 1024,
        maxPayloadLength = 512
    }
} = require("../func/tools");

const WS_PATH = "../ws";

module.exports = app => {
    app.ws('/*', {
        idleTimeout,
        maxBackpressure,
        maxPayloadLength,
    
        upgrade: require(`${WS_PATH}/upgrade.js`),
        open: require(`${WS_PATH}/open.js`),
        message: require(`${WS_PATH}/message.js`),
        close: require(`${WS_PATH}/close.js`)
    });
}