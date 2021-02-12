'use strict';

const response = require('../response');
const db = require('../settings/db');

// api/feedback/getAllFeedback
exports.getAllFeedback = (req, res) => {

    db.query(
        `SELECT idfeedback, feedback.idcustomer, feedback.idpoint, date, rating, notes 
        FROM feedback
        JOIN customer ON customer.idcustomer = feedback.idcustomer
        JOIN point ON point.idpoint = feedback.idpoint`, 
        (error, data) => {
        if (error) {
            response.status(404, error, res);
        } else {
            response.status(200, data.rows, res)
        }
    });

}

// api/points/setPoint
exports.setFeedback = (req, res) => {

    db.query(
        `SELECT idfeedback, feedback.idcustomer, feedback.idpoint, date 
        FROM feedback
        JOIN customer ON customer.idcustomer = feedback.idcustomer
        JOIN point ON point.idpoint = feedback.idpoint
        WHERE date = $1 AND feedback.idcustomer = $2 AND feedback.idpoint = $3`, 
        [req.body.date, req.body.idCutomer, req.body.idPoint],
        (error, data) => {
        if(error) {
            response.status(401, error, res);
        } else if (typeof data.rows !== 'undefined' && data.rows.length > 0) {
            response.status(302, {message: 'Защита от спама отзывами!! Сегодня уже создан отзыв на этот магазин от данного пользователя'}, res);
        } else {
            const date = req.body.date,
                  idCustomer = req.body.idCustomer,
                  idPoint = req.body.idPoint,
                  rating = req.body.rating,
                  notes = req.body.notes;

            db.query(
                `INSERT INTO feedback(idcustomer, idpoint, date, rating, notes)
                VALUES ($1, $2, $3, $4, $5)`,
                [idCustomer, idPoint, date, rating, notes], 
                (error) => {
                if (error) {
                    response.status(400, error, res);
                } else {
                    response.status(200, {message: 'Отзыв успешно добавлен'}, res);
                }
            });
        }
    }); 

}
