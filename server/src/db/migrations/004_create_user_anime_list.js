exports.up = function (knex) {
  return knex.schema.createTable('user_anime_list', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('anime_id').unsigned().notNullable()
      .references('id').inTable('animes').onDelete('CASCADE');
    table.timestamp('added_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'anime_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_anime_list');
};
