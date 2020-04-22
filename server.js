const express = require('express')
//var routes = require('./routes');

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);
var port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	io.sockets.emit("user-joined", socket.id, io.engine.clientsCount, Object.keys(io.sockets.clients().sockets));

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message);
  	});

    socket.on("message", function(data){
		io.sockets.emit("broadcast-message", socket.id, data);
    })

	socket.on('disconnect', function() {
		io.sockets.emit("user-left", socket.id);
	})
});


http.listen(port, () => console.log(`Active on ${port} port`))
