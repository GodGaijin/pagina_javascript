const db = require('./initDb');

const logAudit = (user_id, username, action, entity, entity_id, callback) => {
  db.run(
    `INSERT INTO audits (user_id, username, action, entity, entity_id) VALUES (?, ?, ?, ?, ?)`,
    [user_id, username, action, entity, entity_id],
    function (err) {
      callback && callback(err, this ? this.lastID : null);
    }
  );
};

const getAllAudits = (callback) => {
  db.all('SELECT * FROM audits ORDER BY timestamp DESC', [], callback);
};

module.exports = {
  logAudit,
  getAllAudits,
}; 