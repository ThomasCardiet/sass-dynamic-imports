const sass = require("sass");
const fs = require("fs");
const globImporter = require("./glob-importer"); // Nous allons créer ce fichier ensuite

exports.compileFile = function (source, destination) {
    sass.render(
        {
            file: source,
            importer: globImporter,
        },
        function (err, result) {
            if (err) {
                console.error(`Erreur lors de la compilation de SASS : ${err}`);
                return;
            }
            fs.writeFile(destination, result.css, function (err) {
                if (err) {
                    console.error(`Erreur lors de l'écriture du CSS : ${err}`);
                    return;
                }
                console.log(
                    `SASS compilé avec succès de ${source} à ${destination}`
                );
            });
        }
    );
};
