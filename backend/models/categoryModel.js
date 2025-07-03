const db = require('./initDb');

const getAllCategories = (callback) => {
  db.all('SELECT * FROM product_category', [], callback);
};

const getCategoryById = (id_category, callback) => {
  db.get('SELECT * FROM product_category WHERE id_category = ?', [id_category], callback);
};

const createCategory = (category, callback) => {
  const { category_name, category_details } = category;
  db.run(
    `INSERT INTO product_category (category_name, category_details) VALUES (?, ?)`,
    [category_name, category_details],
    function (err) {
      callback(err, this ? this.lastID : null);
    }
  );
};

const updateCategory = (id_category, category, callback) => {
  const { category_name, category_details } = category;
  db.run(
    `UPDATE product_category SET category_name=?, category_details=? WHERE id_category=?`,
    [category_name, category_details, id_category],
    function (err) {
      callback(err, this ? this.changes : null);
    }
  );
};

const deleteCategory = (id_category, callback) => {
  // First, get the category_name for this category
  db.get('SELECT category_name FROM product_category WHERE id_category = ?', [id_category], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, 0);
    const category_name = row.category_name;
    // Check if any product uses this category_name
    db.get('SELECT COUNT(*) as count FROM products WHERE category_name = ?', [category_name], (err, result) => {
      if (err) return callback(err);
      if (result.count > 0) {
        return callback(new Error('Cannot delete category: it is assigned to one or more products.'));
      }
      // Safe to delete
      db.run('DELETE FROM product_category WHERE id_category = ?', [id_category], function (err) {
        callback(err, this ? this.changes : null);
      });
    });
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}; 