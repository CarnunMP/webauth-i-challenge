const db = require('./db-config');

module.exports = {
  find,
  findById,
  add,
}

function find() {
  return db('users');
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