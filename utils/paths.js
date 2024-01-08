/**
 * @param {string} path
 * @return {String}
 */
const formatPathSlashs = (path) => {
    return path.replace(/\\/g, "/");
};

module.exports = {
    formatPathSlashs,
};
