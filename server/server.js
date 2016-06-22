'use strict';

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Game = require('./game');
var game = new Game();

var routes = require('./routes/index');

var allowCrossDomain = function(req, res, next) {
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


var SocketConnection = require('./socket-connection');
io.on('connection', function(socket) {
    // new SocketConnection(socket);
    // let unit = game.playerJoined();
    // console.log(unit);
    // socket.emit('uuid', unit);

    socket.on('createCharacter', (data) => {
        let character = game.createCharacter(data.name, data.unitClass);
        socket.emit('characterCreated', character);
    });
});

module.exports = app;
