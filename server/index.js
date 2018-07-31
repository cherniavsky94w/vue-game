const config = require('./config');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || config.port;

app.set('trust proxy', true);
app.use(morgan(':date[clf] - :remote-addr - :remote-user :method :status :referrer ":method :url HTTP/:http-version" - :response-time ms'));
app.use(helmet({}));
app.use(cookieParser());
// make express look in the public directory for assets (css/js/img)
app.use(express.static(path.resolve(__dirname,`../dist`)));

require('fs').readdir(path.resolve(__dirname,`../`),(err,f) => console.log(err||f))
// set the home page route
app.get('/', function(req, res) {
    console.log(__dirname);
    require('fs').readdir(path.resolve(__dirname,`../dist`),(err,f) => console.log(err||f))
    // ejs render automatically looks in the views folder
    res.sendFile(path.resolve(__dirname,`../dist/index.html`));
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
