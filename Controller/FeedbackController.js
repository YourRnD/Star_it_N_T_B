'use strict';

const response = require('../response');
const db = require('../settings/db');

// api/feedback/getAllFeedback
exports.getAllFeedback = (req, res) => {

    db.query('SELECT `id`, `date`, `userId`, `pointId`, `rating`, `notes` FROM `feedback`', (error, rows, fields) => {
        if (error) {
            response.status(404, error, res);
        } else {
            response.status(200, rows, res)
        }
    });

}

// api/points/setPoint
exports.setFeedback = (req, res) => {

    db.query('SELECT `id`, `date`, `userId`, `pointId` FROM `feedback` WHERE `date` = "' + req.body.date + '" && `userId` = "' + req.body.userId + '" && `pointId` = "' + req.body.pointId + '"', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            response.status(302, {message: 'Защита от спама отзывами!! Сегодня уже создан отзыв на этот магазин от данного пользователя'}, res);
        } else {
            const date = req.body.date,
                  userId = req.body.userId,
                  pointId = req.body.pointId,
                  rating = req.body.rating,
                  notes = req.body.notes;

            const sql = 'INSERT INTO `feedback`(`date`, `userId`, `pointId`, `rating`, `notes`)' +
                        'VALUES ("' + date + '", "' + userId + '", "' + pointId + '", "' + rating + '", "' + notes + '")';

            db.query(sql, (error, results) => {
                if (error) {
                    response.status(400, error, res);
                } else {
                    response.status(200, {message: 'Отзыв успешно добавлен', results}, res);
                }
            });
        }
    }); 

}
