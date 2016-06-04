var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var express = require("express");
var fileUpload = require('express-fileupload');
var Printer = require('node-printer');
var PDFParser = require('pdf2json');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

//options for printer
var options = {
    media: 'Custom.200x600mm',
    n: 3
};

//index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//search
app.post('/search', function(req, res) {
    var queryname = req.body.queryname;
    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }
        var dataObject = JSON.parse(data.toString());
        var found = findUser(queryname, data);
        if (typeof(found) != "undefined") {
            var history = dataObject.record[found].history;
            console.log(history);
            res.send(history);
        } else {
            res.send('user-not-found');
        }

    })
});

//upload file
app.post('/upload', function(req, res) {
    console.log("upload");

    var tempFile = req.files.file;
    var tempName = req.body.name;

    if (!req.files) {
        res.send('no-file');
        return;
    }

    fs.writeFile(__dirname + "/public/temp/" + tempFile.name, tempFile.data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        res.send("upload-ok");

        printItem(tempFile.name, tempName);
    });
});

//login function
app.post('/login', function(req, res) {
    var queryname = req.body.username;
    var querypassword = req.body.password;
    console.log('login');
    console.log(queryname);
    console.log(querypassword);

    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }

        var dataObject = JSON.parse(data.toString());

        for (var i = 0; i < dataObject.record.length; i++) {

            if (dataObject.record[i].username == queryname && dataObject.record[i].password == querypassword) {
                res.send('ok');
                var boolean = 1;
            }
        }

        if (!boolean) {
            res.send('fail');
        }
    });
});

app.post('/adduser', function(req, res) {
    var addname = req.body.addname;
    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }

        var dataObject = JSON.parse(data.toString());
        var packet = {};
        packet.username = addname;
        packet.history = [];
        packet.password = new Date().getTime().toString();
        dataObject.record.push(packet);

        fs.writeFile(__dirname + "/account.json", JSON.stringify(dataObject), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("done");
            res.send(packet.password);
        });

    })
});

app.post('/paid', function(req, res) {
  console.log('paid');
    var paidname = req.body.paidname;
    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }
        var dataObject = JSON.parse(data.toString());
        var found = findUser(paidname, data);
        if (typeof(found) != "undefined") {
            dataObject.record[found].history=[];
            console.log("history cleared");
            
            fs.writeFile(__dirname+ "/account.json", JSON.stringify(dataObject), function(err){
              if(err){
                return console.log(err);
              }
              console.log("success");
              res.send("success");
            });

        } else {
            res.send('user-not-found');
        }

    })
});

function printItem(filename, username) {
    console.log('Printing Item');

    // printer setting
    // var printer = new Printer('FX_DocuPrint_P265_dw');
    // var jobFromFile = printer.printFile(__dirname+"/public/temp/"+filename);

    var now = new Date().toString();
    var pdfParser = new PDFParser();
    pdfParser.loadPDF(__dirname + '/public/temp/' + filename);
    console.log(filename);


    pdfParser.on('pdfParser_dataReady', function(pdfData) {
        console.log(pdfData.formImage.Pages.length);
        console.log('hi');

        fs.readFile(__dirname + "/account.json", function read(err, data) {
            console.log('reading data');
            if (err) {
                throw err;
            }

            var packet = {};
            packet.date = now;
            packet.filename = filename;
            packet.fee = pdfData.formImage.Pages.length;
            var newData = JSON.parse(data.toString());
            newData.record[0].history.push(packet);


            fs.writeFile(__dirname + "/account.json", JSON.stringify(newData), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("done");
            });


        });
    });


}

function findUser(queryname, data) {
    console.log("queryname: " + queryname);
    for (var i = 0; i < JSON.parse(data.toString()).record.length; i++) {
        if (JSON.parse(data.toString()).record[i].username == queryname) {
            return i;
        }
        console.log("i:" + i);
    }
}

app.server = http.createServer(app);
app.server.listen(3000);
console.log("Starting Server at Localhost:3000");
