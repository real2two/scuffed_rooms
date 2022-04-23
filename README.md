# Scuffed Rooms.

A easy-to-use library that is used to quickly create multiplayer games with a 'room-based' system.

Note: This library was made for myself, so I can quicken development. I'll be adding things accordingly to what I want to add for my own games.

If you find this library useful and actually want me to add stuff to do, make a issue on GitHub with features you would want!

## Setup

Run `npm i scuffed-rooms` to download the library. 

## Template

Simple layout.

```js
const PORT = 80;

require("scuffed-rooms")(PORT, {
    // Username settings.
    minUsernameLength: 3,
    maxUsernameLength: 13,
    
    // Start up custom function.
    onStart: null,
    /*
    onStart: (port, listenSocket) => { // Don't touch "listenSocket" unless you know what you're doing.
        console.log(port);
    },
    */
    
    // The maximum players allowed in a room.
    maxPlayers: 10,

    // The template becomes set to ws.data.
    template: {
        hello: "world"
    },

    // Connection handler.
    onConnect: ws => {
        console.log(ws.room.players);

        //ws.send("test");

        // Get player by ID using: ws.room.getPlayer(id)
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
    unexpectedRoomDeletion: room => {
        console.log(room);
    }
});
```

Bigger layout featuring other stuff you can do with the library.

```js
const PORT = 80;

require("scuffed-rooms")(PORT, {
    // Only change if you know what you are doing.
    ws: {
        idleTimeout: 60,
        maxBackpressure: 1024,
        maxPayloadLength: 512
    },

    // Username settings.
    minUsernameLength: 3, // default: 1
    maxUsernameLength: 13, // default: 32
    customUsernameChecking: username => { // Return "true" to allow the username. Return "false" to end the upgrade request.
        if (username.replace(/[0-9a-zA-Z_]/g, "").length > 0) return false;
        return true;
    },
    disableUsernameDupes: true,
    
    // The maximum players allowed in a room.
    maxPlayers: 10,

    // The template becomes set to ws.data.
    template: {
        hello: "world"
    },

    // Connection handler.
    onConnect: ws => {
        console.log(ws.room.players);

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
    unexpectedRoomDeletion: room => {
        console.log(room);
    }
});
```
