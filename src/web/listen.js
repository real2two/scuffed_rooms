const {
    onStart
} = require("../func/tools");

module.exports = (app, port) => {
    app.listen(port, listenSocket => {
        if (listenSocket) {
            if (typeof onStart === "function") {
                onStart(port, listenSocket);
            } else {
                console.log(`The port is listening on ${port}.`);
            }
        } else {
            console.error(`An error has occured while trying to listen the port.`);
        }
    });
}