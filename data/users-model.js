const db = require('./db-config');

module.exports = {
  find,
  findBy,
  findById,
  add,
}

function find() {
  return db('users');
}

function findBy(filter) {
  return db('users')
    .where(filter)
    .first();
}

function findById(id) {
  return db('users')
    .where( { id })
    .first();
}

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      return findById(ids[0]);
    });
}