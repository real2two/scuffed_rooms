const {
    onStart
} = require("../func/tools");

module.exports = (app, port) => {
    app.listen(port, listenSocket => {
        if (listenSocket) {
            if (typeof onStart === "function") {
                onStart(port, app);
            } else {
                console.log(`The server is listening on port ${port}.`);
            }
        } else {
            console.error(`An error has occured while trying to listen the port.`);
        }
    });
}