const { Config } = require('@foal/core');

module.exports = {
  type: "postgres",
  host: process.env.LOCAL_ADRESS,
  port: process.env.BDD_PORT,
  username: process.env.BDD_USERNAME,
  database: process.env.BDD_DB,
  password: process.env.BDD_PASSWORD,

  dropSchema: Config.get('database.dropSchema', false),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  synchronize: Config.get('database.synchronize', false)
}
