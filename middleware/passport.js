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
                db.query(
                    `SELECT idCustomer, email FROM customer ` +
                    `WHERE idCustomer = $1`,
                    [playload.userId],
                    (error, data) => {
                    if (error) {
                        console.log(error);
                    } else {
                        const user = data.rows;
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