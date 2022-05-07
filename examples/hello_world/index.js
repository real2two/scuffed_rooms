const PORT = 80;
const scuffed_rooms = require("scuffed-rooms"); // require("../../src/func");

scuffed_rooms(PORT, {
    maxRooms: 1,
    maxPlayers: 10,

    template: {
        player: {
            body: {
                x: 0,
                y: 0
            }
        }
    },

    usernames: {
        min: 1,
        max: 13,
        disableDupes: 2
    },

    onConnect: ws => {
        if (ws.room.players.length === 1 && !ws.room.data.sendData) { // Created room.
            ws.room.data.sendData = setInterval(() => {
                const sendPos = [];

                for (const player of ws.room.players) {
                    sendPos.push({
                        u: player.username,
                        x: player.data.body.x,
                        y: player.data.body.y
                    });
                }

                ws.broadcastJSON(sendPos);
            }, 15);
        }
    },

    onMessage: (ws, content) => {
        let message;

        try {
            message = JSON.parse(content);
        } catch(e) {
            return;
        }
        
        if (typeof message.x === "number" && typeof message.y === "number") {
            ws.data.body = {
                x: message.x,
                y: message.y
            }
        }
    },

    onDisconnect: ({ room: { data: { sendData }}}, roomDeleted) => {
        if (roomDeleted && sendData) clearInterval(sendData);
    },
   
    unexpectedRoomDeletion: (ws, { data: sendData }) => {
        if (sendData) clearInterval(sendData);
    }
});