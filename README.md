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
    
    // The maximum players allowed in a room.
    maxPlayers: 10, // default: 100

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
    unexpectedRoomDeletion: (error, room) => {
        console.log(error);
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
    
    // Start up custom function.
    onStart: null,
    /*
    onStart: (port, listenSocket) => { // Don't touch "listenSocket" unless you know what you're doing.
        console.log(port);
    },
    */

    // IP settings.
    saveIPs: true, // default to true.
    ipHeader: null, // default to none. | ex. "x-forwarded-for" and "cf-connecting-ip"
    disableDupeIPs: false, // default to false. This setting disallows having 2 connections with the same IP at once.
    customIPChecking: null,
    /*
    customIPChecking: ip => {
        // ex of what you can do here: have a file with blocked ips,
        // and if their ip is there, reject the connection by returning false.
        // if you like the ip, return true to accept the request.

        return true;
    },
    */

    
    // Username settings.
    minUsernameLength: 3, // default: 1
    maxUsernameLength: 13, // default: 32
    customUsernameChecking: null,
    /*
    customUsernameChecking: username => { // Return "true" to allow the username. Return "false" to end the upgrade request.
        // The example below shows that the server only accepts usernames with numbers, letters, and undercases.
        
        if (username.replace(/[0-9a-zA-Z_]/g, "").length > 0) return false;
        return true;
    },
    */
    disableUsernameDupes: true,
    
    // The maximum rooms there can be, and the maximum players are allowed in a room.
    // Keep in mind a single IP address can only handle 65,536 sockets.
    maxRooms: 100, // default: 100
    maxPlayers: 10, // default: 100

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
    unexpectedRoomDeletion: (error, room) => {
        console.log(error);
    }
});
```
