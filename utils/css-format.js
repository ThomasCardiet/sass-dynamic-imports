const OPTION_KEYS = {
    MINIMIFY: "minimify",
};

/**
 * @param {string} css
 * @return {string}
 */
const formatCssVar = (css) => {
    const regex = /\env\((.*?)\)/g;

    return css
        .toString()
        .replace(regex, (match, variable) => process.env[variable] || "");
};

/**
 * @param {string} css
 * @return {string}
 */
const minimifyCss = (css) => {
    const key = `@${OPTION_KEYS.MINIMIFY};`;

    if (!css.includes(key)) return css;

    let regex = new RegExp(key, "g");
    css = css.replace(regex, "");

    // Supprime les commentaires
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");

    // Supprime les espaces blancs inutiles
    css = css.replace(/\s+/g, " ");

    // Supprime les espaces autour de {}, :, ; et ,
    css = css.replace(/\s*({|}|:|;|,)\s*/g, "$1");

    // Supprime les espaces en début et fin de chaîne
    css = css.trim();

    return css;
};

/**
 * @param {string} css
 * @return {string}
 */
const formatCss = (css) => {
    return minimifyCss(formatCssVar(css));
};

module.exports = {
    formatCssVar,
    minimifyCss,
    formatCss,
};
