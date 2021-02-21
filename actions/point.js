module.exports = ({ db }) => ({
  add: (payload) => {
    const { address, name } = payload;

    return db.query(
      `INSERT INTO point(name, address)
      VALUES ($1, $2) RETURNING *`,
      [name, address]
    );
  },

  delete: (_id) => {
    return db.query(
      `DELETE FROM point
      WHERE idPoint = $1`,
      [_id]
    );
  },

  update: (_id, payload) => {
    const { address, name } = payload;

    return db.query(
      `UPDATE point SET name = $1, address = $2
      WHERE idpoint = $3 RETURNING *`,
      [name, address, _id]
    );
  },

  get: (_id) => {
    return db.query(
      `SELECT * FROM point
      WHERE idpoint = $1`,
      [_id]
    );
  },

  getAll: () => {
    return db.query(
      `SELECT * FROM point`
    );
  }
});