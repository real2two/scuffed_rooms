const app = require('uWebSockets.js').App();

module.exports = (port, tools) => {
    module.exports = null;

    tools = {
        ws: {},
        usernames: {},
        ips: {},

        ...tools
    };
    require("./tools")(tools);

    require("../web/listen")(app, port);
    require("../web/ws")(app, tools);
}