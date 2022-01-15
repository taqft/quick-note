// generate random alpha-numeric strings for storing unique notes objects
module.exports = () =>
    Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
