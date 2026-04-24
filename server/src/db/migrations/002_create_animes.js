exports.up = function (knex) {
  return knex.schema.createTable('animes', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('synopsis').nullable();
    table.string('poster_horizontal_url', 500).nullable();
    table.string('poster_vertical_url', 500).nullable();
    table.enu('type', ['series', 'movie']).defaultTo('series');
    table.enu('status', ['ongoing', 'completed', 'upcoming']).defaultTo('ongoing');
    table.date('release_date').nullable();
    table.datetime('upload_date').defaultTo(knex.fn.now());
    table.boolean('is_banner').defaultTo(false);
    table.integer('banner_order').nullable();
    table.integer('views').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('animes');
};
