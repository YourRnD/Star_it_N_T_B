module.exports = ({ db }) => ({
    add: (payload) => {
        const { name, email, password } = payload;

        return db.query(
            `INSERT INTO customer(name, email, password)
            VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        );
    },

    delete: (_id) => {
        return db.query(
            `DELETE FROM customer
            WHERE idcustomer = $1`,
            [_id]
        );
    },

    update: (_id, payload) => {
        const { name, email, password } = payload;

        console.log(payload);

        return db.query(
            `UPDATE customer 
            SET name = $1, email = $2, password = $3
            WHERE idcustomer = $4 RETURNING *`,
            [name, email, password, _id]
        );
    },

    get: (_id) => {
        return db.query(
            `SELECT idcustomer, name FROM customer
            WHERE idcustomer = $1`,
            [_id]
        );
    },

    getAll: () => {
        return db.query(
            `SELECT idcustomer, name FROM customer`
        );
    },

    getUserByEmail: (payload) => {
        const { email } = payload;
        
        return db.query(
            `SELECT idcustomer, email, password FROM customer 
            WHERE email = $1`,
            [email]
        );
    }
});