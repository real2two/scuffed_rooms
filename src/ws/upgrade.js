const cloneDeep = require('lodash.clonedeep');

const checkUsername = require("../func/usernames");
const checkIP = require("../func/ips");

const {
    allowedOrigin = "*",

    extraProtocols = 0,
    protocolPreJoin,

    idLength = 8,

    maxRooms = 1000,
    maxPlayers = 100,

    template,

    quickJoin: {
        enabled = false,
        publicByDefault = true
    },

    usernames: {
        disableDupes = 0
    },

    ips: {
        header
    }
} = require("../func/tools");

const rooms = require("../func/rooms");

const generateID = () => {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < idLength; ++i) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result;
}

const connected = false;

module.exports = async (res, req, context) => {
    const end = () => res.writeStatus('400').end();

    if (allowedOrigin !== "*") {
        const origin = req.getHeader('origin');
        if (origin.length !== 0 && allowedOrigin !== origin) return end();

        /*
            I tried using headers but it didn't work.
            
            res.writeHeader("Access-Control-Allow-Origin", allowedOrigin);
            res.writeHeader("Access-Control-Allow-Methods", "OPTIONS");
        */
    }

    // IP check.

    const ip = (
        header ?
        req.getHeader(header) :
        undefined
    ) || new TextDecoder().decode(res.getRemoteAddressAsText());

    if (!checkIP(ip)) return end();

    // Arguments

    const sec_websocket_protocol = req.getHeader('sec-websocket-protocol');
    
    if (!sec_websocket_protocol) return end();
    let protocols = sec_websocket_protocol.split(",").map(p => p.replace(/\s+/g, ' ').trim());

    if (![1 + extraProtocols, 2 + extraProtocols].includes(protocols.length)) return end();

    if (
        typeof protocolPreJoin === "function" &&
        protocolPreJoin(cloneDeep(protocols).slice(0, extraProtocols)) === false
    ) return end();

    protocols = protocols.slice(extraProtocols);

    if (maxRooms === 1 && protocols.length === 2) return end();

    let [ username, room_id ] = protocols;

    // Usernames.

    try {
        username = decodeURIComponent(username);
    } catch(e) {
        return end();
    }

    if (!checkUsername(username)) return end();

    // Rooms.

    const rooms_object = Object.entries(rooms);
    let room;

    if (maxRooms === 1 && rooms_object.length === 1) room_id = rooms_object[0][0]; // If max rooms = 1, it sets the room ID to the only room's ID.

    if (typeof room_id === "string") {
        switch (room_id) {
            case "q": // Quick join.
                if (enabled !== true) return end();

                const openRooms = [];
                for (const [ , r ] of rooms_object) {
                    if (r.public === true && r.players.length !== 0 && r.players.length < maxPlayers && (disableDupes === 2 || dupeCheck(r.players) === true)) {
                        openRooms.push(r);
                    }
                }

                if (openRooms.length === 0) { // Create room since no open public rooms were found.
                    if (!createRoom(true)) return end();
                } else { // Join available public room.
                    room = openRooms[Math.floor(Math.random() * openRooms.length)];

                    if (disableDupes === 2 && dupeCheck(room.players) === false) {
                        makeUsernameUnique();
                    }

                    room.players.push({ connected });
                }

                break;

            default: // Join a room with provided room ID.
                if (room_id in rooms === false) return end();

                room = rooms[room_id];
                
                if (room.players.length === 0) return end();
                if (room.players.length >= maxPlayers) return end();

                if (dupeCheck(room.players) === false) {
                    if (disableDupes === 1) return end();

                    if (disableDupes === 2) {
                        makeUsernameUnique();
                    }
                }
        
                room.players.push({ connected });

                break;
        }
    } else {
        if (!createRoom()) return end();
    }

    res.upgrade(
        {
            connected: true,

            room,
            username,
            ip,

            broadcast: room.broadcast,
            broadcastJSON: room.broadcastJSON,
            broadcastBinary: room.broadcastBinary,

            data: cloneDeep(template.player || {})
        },

        req.getHeader('sec-websocket-key'),
        sec_websocket_protocol,
        req.getHeader('sec-websocket-extensions'),

        context
    );

    function createRoom(public = publicByDefault) {
        if (rooms_object.length >= maxRooms) return false;

        for (let i = 0; i < 5; ++i) {
            room_id = generateID();
            if (room_id in rooms === false) break;

            if (i === 4) return false;
        }

        room = {
            removed: false,
            
            id: room_id,
            public,

            data: cloneDeep(template.room || {}),

            players: [{ connected }],
            getPlayer: id => {
                for (const player of room.players) {
                    if (player.id === id) return player;
                }
            },

            broadcast: (message, isBinary) => {
                for (const player of room.players) player.send(message, isBinary, true);
            },

            broadcastJSON: message => {
                for (const player of room.players) player.send(JSON.stringify(message));
            },

            broadcastBinary: (message) => {
                for (const player of room.players) player.send(message, true, true);
            }
        }
        rooms[room_id] = room;

        return room;
    }

    function dupeCheck(players) {
        if ([1, 2].includes(disableDupes)) { // Disallow duplicate usernames.
            for (const playerUsername of players.map(p => p.username)) {
                if (username === playerUsername) return false;
            }
        }
        
        return true;
    }

    function makeUsernameUnique() {
        const oldUsername = username;
        for (let x = 2; room.players.filter(p => p.username === username).length !== 0; ++x) {
            username = oldUsername + x;
        }
    }
}