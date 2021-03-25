module.exports = ({ db }) => ({

  add: (payload) => {
    const { idCustomer, idBusiness } = payload;

    return db.query(
      `INSERT INTO manager(idcustomer, idbusiness)
      VALUES ($1, $2) RETURNING *`,
      [idCustomer, idBusiness]
    );
  },

  delete: (_id) => {
    return db.query(
      `DELETE FROM manager
      WHERE idmanager = $1 RETURNING *`,
      [_id]
    );
  },

  update: (_id, payload) => {
    const { idCustomer, idBusiness } = payload;

    return db.query(
      `UPDATE manager 
      SET idcustomer = $1, idbusiness = $2
      WHERE idmanager = $3 RETURNING *`,
      [idCustomer, idBusiness, _id]
    );
  },

  getWithManagerId: (_id) => {
    return db.query(
      `SELECT * 
      FROM manager as m
      JOIN customer as c ON c.idcustomer = m.idcustomer
      WHERE idmanager = $1`,
      [_id]
    );
  },

  get: (_id) => {
    return db.query(
      `SELECT * 
      FROM manager as m
      JOIN customer as c ON c.idcustomer = m.idcustomer
      WHERE m.idcustomer = $1`,
      [_id]
    );
  },

  getAll: (pageStart) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM manager
      ) as count_rows FROM manager as m
      JOIN customer as c ON c.idcustomer = m.idcustomer
      LIMIT 10 OFFSET ${pageStart}`
    );
  },

  search: (pageStart, value) => {
    return db.query(
      `SELECT *, (
        SELECT COUNT(*) FROM manager
      ) as count_rows FROM manager as m
      JOIN customer as c ON c.idcustomer = m.idcustomer
      WHERE c.name @@ '${value}'
      LIMIT 10 OFFSET ${pageStart}`
    );
  }

});