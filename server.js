var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var express = require("express");
var fileUpload = require('express-fileupload');

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
    fs.writeFile(__dirname+"/public/temp/"+sampleFile.name+".jpg", sampleFile.data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        res.send("ok");
    });
    
});


app.server = http.createServer(app);
app.server.listen(3000);
