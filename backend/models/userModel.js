const db = require('./initDb');
const bcrypt = require('bcryptjs');

const findUserByUsername = (username, callback) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], callback);
};

const createUser = (username, password, role, callback) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role],
    function (err) {
      callback(err, this ? this.lastID : null);
    }
  );
};

const validatePassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const findUserById = (id, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], callback);
};

module.exports = {
  findUserByUsername,
  createUser,
  validatePassword,
  findUserById,
}; 