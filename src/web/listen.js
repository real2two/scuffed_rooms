module.exports = (app, port) => 
    app.listen(port, listenSocket => {
        if (listenSocket) {
            console.log(`[WEB] The port is listening on ${port}.`);
        } else {
            console.log(`[WEB] An error has occured while trying to listen the port.`);
        }
    });