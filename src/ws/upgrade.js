const checkUsername = require("../func/usernames");
const checkIP = require("../func/ips");

const {
    maxRooms = 100,
    maxPlayers = 100,

    template,

    usernames: {
        disableDupes = false
    },

    ips: {
        header
    }
} = require("../func/tools");

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

    if (!checkUsername(username)) return end();

    let room;

    if (typeof room_id === "string") {
        console.log(rooms[room_id])
        if (room_id in rooms === false) return end();
        console.log("yay")

        room = rooms[room_id];
        if (room.players >= maxPlayers) return end();

        if (disableDupes === true) { // Disallow duplicate usernames.
            for (const player_username of Object.entries(room.players).map(p => p[1].username)) {
                if (username === player_username) return end();
            }
        }

        room.players.push({ connected });
    } else {
        if (Object.entries(rooms).length >= maxRooms) return end();

        for (let i = 0; i < 5; i++) {
            room_id = generateID();
            if (room_id in rooms === false) break;

            if (i === 4) return end();
        }

        room = {
            aborted: false,
            
            id: room_id,
            players: [{ connected }],
            getPlayer: id => room.players.filter(p => p.id == id)[0]
        }
        rooms[room_id] = room;
    }

    const ip = (
        header ?
        req.getHeader(header) :
        undefined
    ) || new TextDecoder().decode(res.getRemoteAddressAsText());

    if (!checkIP(ip)) return end();

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