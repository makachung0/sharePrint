var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    express = require('express'),
    port = process.argv[2] || 8888;

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');

});

app.post('/', function(req, res) {
    console.log(req.body);
    
});


app.server = http.createServer(app);
app.server.listen(3000);
