cp .env.example .env
set .env

chmod +x build.sh
./build.sh

chmod +x migrate.sh
./migrate.sh