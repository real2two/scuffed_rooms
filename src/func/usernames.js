const {
    usernames: {
        min = 1,
        max = 32,
        custom
    }
} = require("./tools");

module.exports = username => {
    if (
        username.length < min ||
        username.length > max
    ) return false;

    if (
        typeof custom === "function" &&
        custom(username) === false
    ) return false;

    return true;
}