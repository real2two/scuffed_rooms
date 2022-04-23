const app = require('uWebSockets.js').App();

module.exports = (port, tools) => {
    module.exports = false;

    require("./tools")(tools);

    require("../web/listen")(app, port, tools);
    require("../web/ws")(app, tools);
}