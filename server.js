var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var express = require("express");
var fileUpload = require('express-fileupload');
var Printer = require('node-printer');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());



//index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');

});

//upload file
app.post('/upload', function(req, res) {
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    console.log(req.files);
    sampleFile = req.files.sampleFile;
    fs.writeFile(__dirname + "/public/temp/" + sampleFile.name, sampleFile.data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        
    });
    printItem(sampleFile);

});

//login
app.post('/login', function(req, res) {
    console.log("login detected");
    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }
        if(JSON.parse(data.toString()).record[0].username == req.body.username){
          console.log('OK');
          res.send('ok');
        }else {
          console.log('wrong username');
          console.log(res);
          res.send('fail');
        }
    });
});

function printItem(){
  console.log('Printing Item');
}


app.server = http.createServer(app);
app.server.listen(3000);
console.log("Starting Server at Localhost:3000");
