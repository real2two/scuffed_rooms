const main = document.querySelector("main");
const joinRoom = document.getElementById("joinRoom");
const username = document.getElementById("username");

let ws = null;

function connect() {
    if (username.value.length === 0) return alert("Your username is too short!");
    if (username.value.length > 13) return alert("Your username is too long!");

    joinRoom.style.display = "none";

    ws = new WebSocket(`ws${document.location.protocol == "https:" ? "s" : ""}://${SERVER}`, [ username.value ]);

    let connected = false;

    ws.onopen = () => {
        console.log("[WEBSOCKET] Connected!");

        connected = true;
        main.style.display = "block";

        ws.onmessage = ({ data }) => {
            otherPlayers = JSON.parse(data);
        }
    }

    ws.onclose = () => {
        console.log("[WEBSOCKET] Disconnected.");
        disconnected();
    }

    ws.onerror = evt => {
        console.log("[WEBSOCKET] An error has occured on the WebSocket connection.");
        console.log(evt);
        ws.close();
        disconnected();
    }

    function disconnected() {
        ws = null;
        otherPlayers = [];

        if (connected === true) {
            alert("You have been disconnected from the server!");
        } else {
            alert("Could not join room.");
        }

        main.style.display = "none";
        joinRoom.style.display = "block";
    }
}