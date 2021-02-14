module.exports = ({ db }) => ({
    add: (payload) => {
        const { idCustomer, idPoint, date, rating, notes } = payload;

        return db.query(
            `INSERT INTO feedback(idcustomer, idpoint, date, rating, notes)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [idCustomer, idPoint, date, rating, notes]
        );
    },

    delete: (_id) => {
        return db.query(
            `DELETE FROM feedback
            WHERE idfeedback = $1`,
            [_id]
        );
    },

    update: (_id, payload) => {
        const { idCustomer, idPoint, date, rating, notes } = payload;

        return db.query(
            `UPDATE feedback SET idCustomer = $1, 
            idPoint = $2, date = $3, 
            rating = $4, notes = $5
            WHERE idfeedback = $6 RETURNING *`,
            [idCustomer, idPoint, date, rating, notes, _id]
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

    getAll: () => {
        return db.query(
            `SELECT * 
            FROM feedback as f
            JOIN customer as c ON c.idcustomer = f.idcustomer
            JOIN point as p ON p.idpoint = f.idpoint`
        );
    }
});