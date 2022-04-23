const { onDisconnect } = require("../func/tools");
const rooms = require("../func/rooms");

module.exports = async ws => {
    if (ws.room.aborted) return;
    
    if (ws.room.players.length <= 1) delete rooms[ws.room.id];

    const wsIndex = ws.room.players.indexOf(ws);
    if (wsIndex != -1) ws.room.players.splice(wsIndex, 1);

    if (typeof onDisconnect === "function") onDisconnect(ws, ws.room.players.length === 0);
}