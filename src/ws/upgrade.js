const cloneDeep = require('lodash.clonedeep');

const checkUsername = require("../func/usernames");
const checkIP = require("../func/ips");

const {
    maxRooms = 1000,
    maxPlayers = 100,

    template,

    quickJoin: {
        enabled = false,
        publicByDefault = true
    },

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
    if (maxRooms === 1 && protocols.length === 2) return end();

    let [ username, room_id ] = protocols;

    if (!checkUsername(username)) return end();

    const rooms_object = Object.entries(rooms);
    let room;

    if (maxRooms === 1 && rooms_object.length === 1) room_id = rooms_object[0][0]; // If max rooms = 1, it sets the room ID to the only room's ID.

    if (typeof room_id === "string") {
        switch (room_id) {
            case "q": // Quick join.
                if (enabled !== true) return end();

                const openRooms = [];
                for (const [ , r ] of rooms_object) {
                    if (r.public === true && r.players.length !== 0 && r.players.length < maxPlayers && dupeCheck(r.players)) {
                        openRooms.push(r);
                    }
                }

                if (openRooms.length === 0) { // Create room since no open public rooms were found.
                    if (!createRoom(true)) return end();
                } else { // Join available public room.
                    room = openRooms[Math.floor(Math.random() * openRooms.length)];
                    room.players.push({ connected });
                }

                break;

            default: // Join a room with provided room ID.
                if (room_id in rooms === false) return end();

                room = rooms[room_id];
                
                if (room.players.length === 0) return end();
                if (room.players.length >= maxPlayers) return end();

                if (!dupeCheck(room.players)) return end();
        
                room.players.push({ connected });

                break;
        }
    } else {
        if (!createRoom()) return end();
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

            broadcast: room.broadcast,
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

        for (let i = 0; i < 5; i++) {
            room_id = generateID();
            if (room_id in rooms === false) break;

            if (i === 4) return false;
        }

        room = {
            aborted: false,
            
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
            broadcastBinary: (message) => {
                for (const player of room.players) player.send(message, true, true);
            }
        }
        rooms[room_id] = room;

        return room;
    }

    function dupeCheck(players) {
        if (disableDupes === true) { // Disallow duplicate usernames.
            for (const playerUsername of players.map(p => p.username)) {
                if (username === playerUsername) return false;
            }
        }
        
        return true;
    }
}