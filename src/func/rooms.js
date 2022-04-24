const { maxRooms, maxPlayers, unexpectedRoomDeletion } = require("./tools");

setInterval(() => {
    const check_rooms = Object.entries(module.exports);
    if (check_rooms.length >= maxRooms) {
        for (const [ , room ] of check_rooms.slice(maxRooms)) {
            delete module.exports[room.id];

            if (typeof unexpectedRoomDeletion === "function") unexpectedRoomDeletion("exceeds_rooms", room);

            room.aborted = true;
            for (const player of room.players) player.close();
        }
    }

    for (const [ , room ] of Object.entries(module.exports)) {
        if (room.players.length === 0) {
            delete module.exports[room.id];
            if (typeof unexpectedRoomDeletion === "function") unexpectedRoomDeletion("no_players", room);
            
            continue;
        }

        if (room.players.length > maxPlayers) {
            for (const player of room.players.slice(maxPlayers)) player.close();
        }
    }
}, 5000);

module.exports = {};