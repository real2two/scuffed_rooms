const { minUsernameLength, maxUsernameLength, customUsernameChecking, maxPlayers, disableUsernameDupes, saveIPs, ipHeader, disableDupeIPs, customIPChecking, template } = require("../func/tools");
const rooms = require("../func/rooms");

const generateID = () => Math.random().toString().slice(-8);

const connected = false;

module.exports = async (res, req, context) => {
    const end = () => res.writeStatus('400').end();

    const sec_websocket_protocol = req.getHeader('sec-websocket-protocol');
    
    if (!sec_websocket_protocol) return end();
    const protocols = sec_websocket_protocol.split(",").map(p => p.replace(/\s+/g, ' ').trim());

    if (![1, 2].includes(protocols.length)) return end();
    let [ username, room_id ] = protocols;

    if (username.length < (minUsernameLength || 1)) return end();
    if (username.length > (maxUsernameLength || 32)) return end();

    if (typeof customUsernameChecking === "function")
        if (customUsernameChecking(username) === false)
            return end();

    let room;

    if (typeof room_id === "string") {
        room = rooms[room_id];
        if (!room) return end();
        if (room.players >= maxPlayers) return end();

        if (disableUsernameDupes === true)
            for (const player_username of Object.entries(room.players).map(p => p[1].username))
                if (username === player_username) return end();

        room.players.push({ connected });
    } else {
        for (let i = 0; i < 5; i++) {
            room_id = generateID();
            if (!rooms[room_id]) break;

            if (i === 4) return end();
        }

        room = {
            id: room_id,
            players: [{ connected }],
            getPlayer: id => room.players.filter(p => p.id == id)[0]
        }
        rooms[room_id] = room;
    }

    let ip;
    
    if (saveIPs != false) {
        ip = (
            ipHeader ?
            req.getHeader(ipHeader) :
            undefined
        ) || new TextDecoder().decode(res.getRemoteAddressAsText());

        if (disableDupeIPs === true) {
            for (const [ , { players } ] of Object.entries(rooms)) {
                for (const player of players) {
                    if (player.ip == ip) return end();
                }
            }
        }

        if (typeof customIPChecking === "function") {
            if (customIPChecking(ip) === false) return end();
        }
    }

    res.upgrade(
        {
            connected: true,
            room,
            username,

            ip,

            data: template || {}
        },

        req.getHeader('sec-websocket-key'),
        sec_websocket_protocol,
        req.getHeader('sec-websocket-extensions'),

        context
    );
}