#! /bin/bash
cd ihm
npm i
npm run build
cd ..
cp -r ./ihm/www/* ./api/public/
docker-compose up -d --build
