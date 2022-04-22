const { maxPlayers, unexpectedRoomDeletion } = require("./tools");

setInterval(() => {
    for (const [ , room ] of Object.entries(module.exports)) {
        if (room.players.length === 0) {
            delete module.exports[room.id];
            if (typeof unexpectedRoomDeletion === "function") unexpectedRoomDeletion(room);
            
            continue;
        }

        if (room.players.length > maxPlayers)
            for (const player of room.players.slice(maxPlayers))
                player.close();
    }
}, 5000);

module.exports = {};