const { Config } = require('@foal/core');

module.exports = {
  type: "postgres",
  host: "box2.tekin.fr",
  port: 4011,
  username: "postgres",
  database: "test",
  password: "test",

  dropSchema: Config.get('database.dropSchema', false),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  synchronize: Config.get('database.synchronize', false)
}
