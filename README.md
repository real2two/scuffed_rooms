# Scuffed Rooms.

A easy-to-use library that is used to quickly create multiplayer games with a 'room-based' system.

Note: This library was made for myself, so I can quicken development. I'll be adding things accordingly to what I want to add for my own games.

If you find this library useful and actually want me to add stuff to do, make a issue on GitHub with features you would want!

## Setup

Run `npm i scuffed-rooms` to download the library.

## Examples

Examples are listed in the "examples" folder.

## Template

Simple layout.

```js
const PORT = 80;

require("scuffed-rooms")(PORT, {
    // The maximum players allowed in a room.
    maxPlayers: 10, // default: 100

    // Quick join. (when joining the websocket, the "room id" must be set to "q".)
    quickJoin: {
        enabled: true, // default: false (won't work if the maximum rooms is 1.)
        publicByDefault: true // default: true (won't do anything if quickJoin is disabled.)
    },

    // The template becomes set to <room>.data for rooms, and <ws>.data for players.
    template: {
        room: {
            hello: "world"
        },
        player: {
            hello: "world"
        }
    },

    // Username settings.
    username: {
        min: 3, // default: 1
        max: 13, // default: 32
    },

    // Connection handler.
    onConnect: ws => {
        console.log(ws);

        //ws.send("test");

        // Get player by ID using: ws.room.getPlayer(id).
    },

    // Message handlers.
    onMessage: (ws, content) => {
        console.log(content);
    },

    // Disconnection handler.
    onDisconnect: (ws, roomDeleted) => {
        console.log(ws);
        console.log("was the room delete:", roomDeleted);
    },

    // Unexpected room deletion. (room deletions not handled by onDisconnect() for some reason.)
    unexpectedRoomDeletion: (error, room) => {
        console.log(error);
    }
});
```

Bigger layout featuring other stuff you can do with the library.

```js
const PORT = 80;

const rooms = require("scuffed-rooms")(PORT, {
    // Only change if you know what you are doing.
    ws: {
        idleTimeout: 60,
        maxBackpressure: 1024,
        maxPayloadLength: 512
    },
    
    // Start up custom function.
    onStart: null,
    /*
    onStart: (port, app) => { // Don't touch "app" unless you know what you're doing.
        console.log(port);

        app.get('/*', (res, req) => {
            res.writeStatus('200 OK').end('Hello world!');
        })
    },
    */


    // The maximum rooms there can be, and the maximum players are allowed in a room.
    // Keep in mind a single IP address can only handle 65,536 sockets.
    maxRooms: 100, // default: 1000
    maxPlayers: 10, // default: 100

    // Quick join. (when joining the websocket, the "room id" must be set to "q".)
    quickJoin: {
        enabled: true, // default: false (won't work if the maximum rooms is 1.)
        publicByDefault: true // default: true (won't do anything if quickJoin is disabled.)
    },

    // The template becomes set to <room>.data for rooms, and <ws>.data for players.
    template: {
        room: {
            hello: "world"
        },
        player: {
            hello: "world"
        }
    },


    // IP settings.
    ips: {
        header: null, // default to none. | ex. "x-forwarded-for" and "cf-connecting-ip".
        disableDupes: false, // default to false. This setting disallows having 2 connections with the same IP at once.
        custom: null
        /*
        custom: ip => {
            // Here's an idea of what you can do here:
            // 1. Create a file with blocked ips.
            // 2. When the server starts, cache the file.
            // 3a. When someone connects to the server and their ip is in the file, reject the connection by returning false.
            // 3b. If the ip is not listed in the list of blocked ips, return true to accept the request.

            return true;
        }
        */
    },

    // Username settings.
    username: {
        min: 3, // default: 1
        max: 13, // default: 32
        custom: null
        /*
        custom: username => { // Return "true" to allow the username. Return "false" to end the upgrade request.
            // The example below shows that the server only accepts usernames with numbers, letters, and undercases.

            if (username.replace(/[0-9a-zA-Z_]/g, "").length > 0) return false;
            return true;
        }
        */
        disableDupes: false // default: false
    },


    // Connection handler.
    onConnect: ws => {
        console.log(ws);

        //ws.send("test");
        //ws.sendBinary([0]);

        // Get player by ID using: ws.room.getPlayer(id)
    },

    // Message handlers.
    onMessage: (ws, content) => {
        console.log(content);
    },

    binaryMessageType: Uint8Array, // Default to "new Uint8Array()". Do not touch if you don't know what you're doing.
    onBinaryMessage: (ws, content) => {
        console.log(content);
    },

    // Disconnection handler.
    onDisconnect: (ws, roomDeleted) => {
        console.log(ws);
        console.log("was the room delete:", roomDeleted);
    },

    // Unexpected room deletion. (room deletions not handled by onDisconnect() for some reason.)
    unexpectedRoomDeletion: (error, room) => {
        console.log(error);
    }
});
```

## Note

For HTML developers: You need to add `<ws>.binaryType = "arraybuffer";` to receive binary messages.