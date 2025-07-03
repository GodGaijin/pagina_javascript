const db = require('./initDb');

const getOwnCommerce = (callback) => {
  db.get('SELECT * FROM own_commerce LIMIT 1', [], callback);
};

const upsertOwnCommerce = (data, callback) => {
  // Si existe, actualiza; si no, inserta
  getOwnCommerce((err, row) => {
    if (err) return callback(err);
    if (row) {
      db.run(
        'UPDATE own_commerce SET name = ?, rif = ?, location = ?, description = ? WHERE id = ?',
        [data.name, data.rif, data.location, data.description, row.id],
        function (err) {
          callback(err, { updated: true });
        }
      );
    } else {
      db.run(
        'INSERT INTO own_commerce (name, rif, location, description) VALUES (?, ?, ?, ?)',
        [data.name, data.rif, data.location, data.description],
        function (err) {
          callback(err, { inserted: true });
        }
      );
    }
  });
};

module.exports = {
  getOwnCommerce,
  upsertOwnCommerce
}; 