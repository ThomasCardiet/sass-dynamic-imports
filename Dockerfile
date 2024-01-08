# Utiliser une image Node.js officielle comme image de base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/sass-dynamic-imports
# Copier les fichiers de configuration de package npm dans le répertoire de travail et installer les dépendances
COPY package*.json ./
RUN npm ci
RUN npm install chokidar
RUN npm install glob
RUN npm install globby
RUN npm install is-glob
RUN npm install lodash
RUN npm install object-assign
RUN npm install pify
RUN npm install resolve
RUN npm install sass
RUN npm install dotenv
RUN npm install --save-dev concurrently
RUN npm install -g sass-dynamic-imports

# Copier le reste du code source du projet dans le répertoire de travail
COPY . .