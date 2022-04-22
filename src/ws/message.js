const enc = new TextDecoder("utf-8");
const { binaryMessageType, onBinaryMessage, onMessage } = require("../func/tools");

module.exports = (ws, message, isBinary) => {
    if (isBinary) {
        const content = [ ...new (binaryMessageType || Uint8Array)(message) ];
        if (typeof onBinaryMessage === "function") onBinaryMessage(ws, content);
    } else {
        if (typeof onMessage === "function") onMessage(ws, enc.decode(new Uint8Array(message)));
    }
}