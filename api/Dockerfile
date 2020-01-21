FROM node:slim
WORKDIR /home/node/app
COPY package.json .
RUN npm i
COPY src ./src
COPY config config
COPY public public
COPY ormconfig.js ormconfig.js
COPY ormconfig.js ormconfig.js
COPY ormconfig.js ormconfig.js
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.test.json tsconfig.test.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.migrations.json tsconfig.migrations.json
RUN npm run build:app
CMD ["npm","run","start"]