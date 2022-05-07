const nextID = room => {
    const ids = room.players.map(user => user.id);

    let id = 0;
    while (ids.includes(id)) ++id;
    
    return id;
}

const { onConnect } = require("../func/tools");

module.exports = async ws => {
    ws.sendJSON = value => ws.send(JSON.stringify(value));
    ws.sendBinary = value => ws.send(new Uint8Array(value), true, true);

    ws.id = nextID(ws.room);
    ws.room.players[ws.room.players.map(p => p.connected).indexOf(false)] = ws;

    if (typeof onConnect === "function") onConnect(ws);
};