module.exports = ({ db }) => ({
  add: (payload) => {
    const { name, email, password } = payload;

    return db.query(
      `INSERT INTO customer(name, email, password, idright)
      VALUES ($1, $2, $3, 1) RETURNING *`,
      [name, email, password]
    );
  },

  delete: (_id) => {
    return db.query(
      `DELETE FROM customer 
      WHERE idcustomer = $1 RETURNING *`,
      [_id]
    );
  },

  update: (_id, payload) => {
    const { name, email, password, idright } = payload;

    return db.query(
      `UPDATE customer 
      SET name = $1, email = $2, 
      password = $3, idright = $4
      WHERE idcustomer = $5 RETURNING *`,
      [name, email, password, idright, _id]
    );
  },

  get: (_id) => {
    return db.query(
      `SELECT * 
      FROM customer
      WHERE idcustomer = $1`,
      [_id]
    );
  },

  getAll: (pageStart) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM customer
      ) as count_rows FROM customer
      LIMIT 10 OFFSET ${pageStart}`
    );
  },

  search: (pageStart, value) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM customer
      ) as count_rows FROM customer
      WHERE name @@ '${value}'
      LIMIT 10 OFFSET ${pageStart}`
    );
  },

  getUserByEmail: (payload) => {
    const { email } = payload;

    return db.query(
      `SELECT * FROM customer 
      WHERE email = $1`,
      [email]
    );
  },
});
