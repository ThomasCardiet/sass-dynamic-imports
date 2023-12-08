const sass = require("sass");
const fs = require("fs");
const globImporter = require("./glob-importer");

exports.compileFile = function (source, destination) {
    sass.render(
        {
            file: source,
            importer: globImporter,
        },
        function (err, result) {
            if (err) {
                console.error(`Error compiling SASS : ${err}`);
                return;
            }
            fs.writeFile(destination, result.css, function (err) {
                if (err) {
                    console.error(`Error writing CSS : ${err}`);
                    return;
                }
                console.log(
                    `SASS compiled successfully from ${source} to ${destination}`
                );
            });
        }
    );
};
