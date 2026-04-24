require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations',
      extension: 'js',
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'js',
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.pragma('journal_mode = WAL');
        conn.pragma('foreign_keys = ON');
        cb();
      },
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'anime_db',
    },
    migrations: {
      directory: './src/db/migrations',
      extension: 'js',
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'js',
    },
  },
};
