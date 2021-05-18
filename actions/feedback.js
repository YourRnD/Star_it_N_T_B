module.exports = ({ db }) => ({
  add: (payload) => {
    const { idCustomer, idPoint, date, rating, notes, path } = payload;

    return db.query(
      `INSERT INTO feedback(idcustomer, idpoint, date, rating, notes, path)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [idCustomer, idPoint, date, rating, notes, path]
    );
  },

  delete: (_id) => {
    return db.query(
      `DELETE FROM feedback
      WHERE idfeedback = $1 RETURNING *`,
      [_id]
    );
  },

  update: (_id, payload) => {
    const { idCustomer, idPoint, date, rating, notes, path } = payload;

    return db.query(
      `UPDATE feedback SET idCustomer = $1, 
      idPoint = $2, date = $3, 
      rating = $4, notes = $5,
      path = $6
      WHERE idfeedback = $7 RETURNING *`,
      [idCustomer, idPoint, date, rating, notes, path, _id]
    );
  },

  get: (_id) => {
    return db.query(
      `SELECT * 
      FROM feedback as f
      JOIN customer as c ON c.idcustomer = f.idcustomer
      JOIN point as p ON p.idpoint = f.idpoint
      WHERE idfeedback = $1`,
      [_id]
    );
  },

  getAll: (pageStart) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM feedback
      ) as count_rows FROM feedback as f
      JOIN customer as c ON c.idcustomer = f.idcustomer
      JOIN point as p ON p.idpoint = f.idpoint
      LIMIT 10 OFFSET ${pageStart}`
    );
  },

  search: async (pageStart, value) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FILTER (WHERE p.name @@ '${value}')
        FROM feedback as f
        JOIN point as p ON p.idpoint = f.idpoint
      ) as count_rows
      FROM feedback as f
      JOIN customer as c ON c.idcustomer = f.idcustomer
      JOIN point as p ON p.idpoint = f.idpoint
      WHERE p.name @@ '${value}'
      LIMIT 10 OFFSET ${pageStart}`
    );
  }
});