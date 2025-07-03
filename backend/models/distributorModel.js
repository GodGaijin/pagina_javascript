const db = require('./initDb');

const getAllDistributors = (callback) => {
  db.all('SELECT * FROM distributors', [], callback);
};

const getDistributorById = (id, callback) => {
  db.get('SELECT * FROM distributors WHERE id = ?', [id], callback);
};

const createDistributor = (distributor, callback) => {
  const { commerce_name, location } = distributor;
  db.run(
    `INSERT INTO distributors (commerce_name, location) VALUES (?, ?)`,
    [commerce_name, location],
    function (err) {
      callback(err, this ? this.lastID : null);
    }
  );
};

const updateDistributor = (id, distributor, callback) => {
  const { commerce_name, location } = distributor;
  db.run(
    `UPDATE distributors SET commerce_name=?, location=? WHERE id=?`,
    [commerce_name, location, id],
    function (err) {
      callback(err, this ? this.changes : null);
    }
  );
};

const deleteDistributor = (id, callback) => {
  // First, get the commerce_name for this distributor
  db.get('SELECT commerce_name FROM distributors WHERE id = ?', [id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, 0);
    const commerce_name = row.commerce_name;
    // Check if any product uses this commerce_name
    db.get('SELECT COUNT(*) as count FROM products WHERE commerce_name = ?', [commerce_name], (err, result) => {
      if (err) return callback(err);
      if (result.count > 0) {
        return callback(new Error('Cannot delete distributor: it is assigned to one or more products.'));
      }
      // Safe to delete
      db.run('DELETE FROM distributors WHERE id = ?', [id], function (err) {
        callback(err, this ? this.changes : null);
      });
    });
  });
};

module.exports = {
  getAllDistributors,
  getDistributorById,
  createDistributor,
  updateDistributor,
  deleteDistributor,
}; 