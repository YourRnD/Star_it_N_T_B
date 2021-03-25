module.exports = ({ db }) => ({
  add: (payload) => {
    const { address, name, idbusiness } = payload;

    return db.query(
      `INSERT INTO point(name, address, idbusiness)
      VALUES ($1, $2, $3) RETURNING *`,
      [name, address, idbusiness]
    );
  },

  delete: (_id) => {
    return db.query(
      `DELETE FROM point
      WHERE idpoint = $1 RETURNING *`,
      [_id]
    );
  },

  update: (_id, payload) => {
    const { address, name, idbusiness } = payload;

    return db.query(
      `UPDATE point SET name = $1, address = $2, idbusiness = $3
      WHERE idpoint = $4 RETURNING *`,
      [name, address, idbusiness, _id]
    );
  },

  get: (_id) => {
    return db.query(
      `SELECT * FROM point
      WHERE idpoint = $1`,
      [_id]
    );
  },

  getAll: (pageStart) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM point
      ) as count_rows FROM point
      LIMIT 10 OFFSET ${pageStart}`
    );
  },

  search: (pageStart, value) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM point
      ) as count_rows FROM point
      WHERE name @@ '${value}'
      LIMIT 10 OFFSET ${pageStart}`
    );
  }
});