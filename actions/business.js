module.exports = ({ db }) => ({
  add: (payload) => {
    const { name, path } = payload;

    return db.query(
      `INSERT INTO business(name, path)
      VALUES ($1, $2) RETURNING *`,
      [name, path]
    );
  },

  delete: (_id) => {
    return db.query(
      `DELETE FROM business
      WHERE idbusiness = $1 RETURNING *`,
      [_id]
    );
  },

  update: (_id, payload) => {
    const { name, path } = payload;

    return db.query(
      `UPDATE business SET name = $1, path = $2
      WHERE idbusiness = $3 RETURNING *`,
      [name, path, _id]
    );
  },

  get: (_id) => {
    return db.query(
      `SELECT * FROM business
      WHERE idbusiness = $1`,
      [_id]
    );
  },

  getAll: (pageStart) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM business
      ) as count_rows FROM business
      LIMIT 10 OFFSET ${pageStart}`
    );
  },

  search: (pageStart, value) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FILTER (WHERE name @@ '${value}') FROM business
      ) as count_rows FROM business
      WHERE name @@ '${value}'
      LIMIT 10 OFFSET ${pageStart}`
    );
  }
});