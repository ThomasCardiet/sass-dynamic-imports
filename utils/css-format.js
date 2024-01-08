const formatCssVar = (css) => {
    const regex = /\env\((.*?)\)/g;

    return css
        .toString()
        .replace(regex, (match, variable) => process.env[variable] || "");
};

module.exports = {
    formatCssVar,
};
