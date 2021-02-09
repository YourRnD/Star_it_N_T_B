const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      config = require('./../config'),
      db = require('./../settings/db');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (playload, done) => {
            try {
                db.query('SELECT `id`, `email` FROM `users` WHERE `id` = "' + playload.userId + '"', (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                    } else {
                        const user = rows;
                        if (user) {
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                    }
                })
            } catch (e) {
                console.log(e);
            }
        })
    )
}