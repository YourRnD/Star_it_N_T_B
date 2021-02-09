'use strict';

module.exports = (app) => {
    const passport = require('passport');
    const usersController = require('./../Controller/UsersController');
    const pointsController = require('./../Controller/PointsController');
    const feedbackController = require('./../Controller/FeedbackController');

    //api/users
    app
        .route('/api/users/getAllUsers')
        .get(passport.authenticate('jwt', {
            session: false
        }), usersController.getAllUsers);
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