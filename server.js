const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const inject = require('require-all');

const app = express();
const router = express.Router;
const port = process.env.PORT || 3500;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./middleware/passport')(passport);

try {
    const controllers = inject(__dirname + '/controllers');

    for (const name in controllers) {
        app.use(`/api/${name}`, controllers[name](router));
    }

    console.log(controllers);
} catch (e) {
    console.error(e);
}

//const routes = require('./settings/routes');
//routes(app);


app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});