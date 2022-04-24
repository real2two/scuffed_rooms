const {
    ips: {
        disableDupes = false,
        custom
    }
} = require("./tools");

const rooms = require("./rooms");

module.exports = ip => {
    if (disableDupes === true) {
        for (const [ , { players } ] of Object.entries(rooms)) {
            for (const player of players) {
                if (player.ip == ip) return false;
            }
        }
    }

    if (
        typeof custom === "function" &&
        custom(ip) === false
    ) return false;

    return true;
}