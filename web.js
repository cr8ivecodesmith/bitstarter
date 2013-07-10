var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
var hello_readfile = fs.readFile('index.html');
var hello_buffer = new Buffer(hello_readfile, 'utf-8');
var hello_string = hello_buffer.toString(); 

app.get('/', function(request, response) {
  response.send(hello_string);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
