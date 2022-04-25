const app = require('uWebSockets.js').App();

module.exports = (port, tools) => {
    module.exports = null;

    tools = {
        ws: {},
        template: {},
        usernames: {},
        ips: {},
        quickJoin: {},

        ...tools
    };
    require("./tools")(tools);

    require("../web/listen")(app, port);
    require("../web/ws")(app, tools);

    return require("./rooms");
}