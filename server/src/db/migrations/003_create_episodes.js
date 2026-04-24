exports.up = function (knex) {
  return knex.schema.createTable('episodes', (table) => {
    table.increments('id').primary();
    table.integer('anime_id').unsigned().notNullable()
      .references('id').inTable('animes').onDelete('CASCADE');
    table.integer('episode_number').notNullable();
    table.string('title', 255).notNullable();
    table.string('video_url', 500).nullable();
    table.integer('duration').nullable().comment('时长（秒）');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('episodes');
};
