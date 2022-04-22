const WS_PATH = "../ws";

module.exports = (app, tools) => 
    app.ws('/*', {
        idleTimeout: tools.ws && tools.ws.idleTimeout ? parseFloat(tools.ws.idleTimeout) : 60,
        maxBackpressure: tools.ws && tools.ws.maxBackpressure ? parseFloat(tools.ws.maxBackpressure) : 1024,
        maxPayloadLength: tools.ws && tools.ws.maxPayloadLength ? parseFloat(tools.ws.maxPayloadLength) : 512,
    
        upgrade: require(`${WS_PATH}/upgrade.js`),
        open: require(`${WS_PATH}/open.js`),
        message: require(`${WS_PATH}/message.js`),
        close: require(`${WS_PATH}/close.js`)
    });