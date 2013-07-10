var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
var hello_string = fs.readFile('index.html');
var hello_buffer = new Buffer(hello_string, 'utf-8');

app.get('/', function(request, response) {
  response.send(hello_buffer.toString('utf-8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
