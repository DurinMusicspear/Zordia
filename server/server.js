'use strict';

let express = require('express');
let path = require('path');
// let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let Game = require('./services/game');
let NetworkEngine = require('./services/network-engine');
let routes = require('./routes/index');

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
// app.use(favicon('../client/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));
// app.use(express.static(path.join(__dirname, '../../dist')));
// app.use(express.static(path.join(__dirname, '../styles')));
// app.use(express.static(path.join(__dirname, '../jspm_packages')));
app.use('/', routes);

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

let game = new Game();
let network = new NetworkEngine(io, game);
game.setNetworkEngine(network);

module.exports = app;
