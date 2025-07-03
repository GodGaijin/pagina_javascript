const db = require('./initDb');

const getAllProducts = (callback) => {
  db.all(`SELECT p.*, d.commerce_name, c.category_name FROM products p
          JOIN distributors d ON p.id_commerce = d.id
          JOIN product_category c ON p.id_category = c.id_category`, [], callback);
};

const getProductById = (id, callback) => {
  db.get(`SELECT p.*, d.commerce_name, c.category_name FROM products p
          JOIN distributors d ON p.id_commerce = d.id
          JOIN product_category c ON p.id_category = c.id_category
          WHERE p.id = ?`, [id], callback);
};

const createProduct = (product, callback) => {
  const { product_name, serial_number, product_details, price, amount, id_commerce, id_category } = product;
  db.run(
    `INSERT INTO products (product_name, serial_number, product_details, price, amount, id_commerce, id_category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [product_name, serial_number, product_details, price, amount, id_commerce, id_category],
    function (err) {
      callback(err, this ? this.lastID : null);
    }
  );
};

const updateProduct = (id, product, callback) => {
  const { product_name, serial_number, product_details, price, amount, id_commerce, id_category } = product;
  db.run(
    `UPDATE products SET product_name=?, serial_number=?, product_details=?, price=?, amount=?, id_commerce=?, id_category=? WHERE id=?`,
    [product_name, serial_number, product_details, price, amount, id_commerce, id_category, id],
    function (err) {
      callback(err, this ? this.changes : null);
    }
  );
};

const deleteProduct = (id, callback) => {
  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    callback(err, this ? this.changes : null);
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}; 