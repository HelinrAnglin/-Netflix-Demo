exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('nickname', 255).notNullable();
    table.string('avatar_url', 500).nullable();
    table.enu('role', ['user', 'admin']).defaultTo('user');
    table.enu('status', ['active', 'disabled']).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
