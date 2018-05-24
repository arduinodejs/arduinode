let express = require('express');
let app = express();

let server = require('http').Server(app);
let io = require('socket.io')(server, {
    path: '/arduinoserver'
});

let apiController = require('./controllers/apiController');
let apiSocket = require('./controllers/apiSocket');

let port = process.env.PORT || 3003;

app.use('/', express.static(__dirname + '/public'));

apiController(app);
apiSocket(io);

server.listen(port);