var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'Client')));

app.get('/app', function(req, res) {
    res.sendFile(path.join(__dirname, 'Client', 'app.html'));
});

app.get('/app.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'Client', 'app.html'));
});

app.get('/landing', function(req, res) {
    res.sendFile(path.join(__dirname, 'Client', 'index.html'));
});

app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'Client', 'index.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'Client', 'index.html'));
});

app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'Client', 'index.html'));
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("Server running on http://localhost:" + port);
});