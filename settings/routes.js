'use strict';

module.exports = (app) => {
    const passport = require('passport');
<<<<<<< HEAD
    const usersController = require('../controllers/customer');
    const pointsController = require('../controllers/point');
    const feedbackController = require('../controllers/feedback');
=======
    const usersController = require('./../Controller/UsersController');
    const pointsController = require('./../Controller/PointsController');
    const feedbackController = require('./../Controller/FeedbackController');
>>>>>>> 6dbcb7ce04e2e5aff212bfcd9e49c3804c585b06
    
    //api/users
    app
        .route('/api/users/signup')
        .post(usersController.signup);
    app
        .route('/api/users/signin')
        .get(usersController.signin);
    
    //api/points
    app
        .route('/api/points/getAllPoints')
        .get(passport.authenticate('jwt', {
            session: false
        }), pointsController.getAllPoints);
    app
        .route('/api/points/setPoint')
        .post(passport.authenticate('jwt', {
            session: false
        }), pointsController.setPoint);
    //api/feedback
    app
        .route('/api/feedback/getAllFeedback')
        .get(passport.authenticate('jwt', {
            session: false
        }), feedbackController.getAllFeedback);
    app
        .route('/api/feedback/setFeedback')
        .post(passport.authenticate('jwt', {
            session: false
        }), feedbackController.setFeedback);
};