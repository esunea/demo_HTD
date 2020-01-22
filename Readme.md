Prerequies : 
 - sudo apt-get install npm
 - sudo apt-get install docker
 - sudo apt-get install docker-compose
 - npm install -g ionic
    

cp .env.example .env

#set .env

chmod +x build.sh

cd ihm2

sudo ionic build --prod

./build.sh

chmod +x migrate.sh

./migrate.sh