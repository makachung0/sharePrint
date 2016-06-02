var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var express = require("express");
var fileUpload = require('express-fileupload');
var Printer = require('node-printer');
var PDFParser = require('pdf2json');
// var bodyParser = require('body-Parser');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

var options = {
    media: 'Custom.200x600mm',
    n: 3
};

//index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');

});

// app.get('/admin', function(req, res){
//     res.sendFile(__dirname + 'public/admin.html');
// });

app.post('/search', function(req, res) {
    console.log('Search Function');
    var queryname = req.body.queryname;
    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }

        var found = findUser(queryname, data);
        console.log("found: " + found);
        if (typeof(found) != "undefined") {
            // console.log(JSON.parse(data.toString()).record[found]);
            var history = JSON.parse(data.toString()).record[found].history;
            console.log(history);
        }
        res.send(history);
    })
});

//upload file
app.post('/upload', function(req, res) {
    var sampleFile;
    var accountName = req.body.account;


    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    // console.log(req.files);
    // console.log(req.body.account);

    sampleFile = req.files.sampleFile;
    fs.writeFile(__dirname + "/public/temp/" + sampleFile.name, sampleFile.data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        res.sendFile(__dirname + '/public/pages/personal.html');

    });

    printItem(sampleFile.name, accountName);

});

//login
app.post('/login', function(req, res) {
    console.log("login detected");

    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }
        for (var i = 0; i < JSON.parse(data.toString()).record.length; i++) {
            if (JSON.parse(data.toString()).record[i].username == req.body.username) {
                console.log('OK');
                var boolean = 1;
            }
        }
        if (boolean) {
            res.send('ok');
        } else {
            res.send('fail');
        }

    });
});

function printItem(sampleFileName, accountName) {
    console.log('Printing Item');
    // var printer = new Printer('FX_DocuPrint_P265_dw');
    // var jobFromFile = printer.printFile(__dirname+"/public/temp/"+sampleFileName);
    var now = new Date();
    console.log(now);
    var pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataReady', function(pdfData) {
        console.log(pdfData.formImage.Pages.length);

        fs.readFile(__dirname+"/account.json", function read(err, data){
          if(err){
            throw err;
          }
          
          console.log("data before:");
          console.log(JSON.parse(data.toString()));

          var packet = {};
          packet.date = now;
          packet.filename = sampleFileName;
          packet.fee = pdfData.formImage.Pages.length;
          var newData = JSON.parse(data.toString());
          newData.record[0].history.push(packet);

          // JSON.parse(data.toString()).record[findUser(accountName, data)].history.date = now;
          // JSON.parse(data.toString()).record[findUser(accountName, data)].history.filename = sampleFileName;
          // JSON.parse(data.toString()).record[findUser(accountName, data)].history.fee = pdfData.formImage.Pages.length;
          
          console.log("data after");
          console.log(JSON.stringify(newData));

          fs.writeFile(__dirname+"/account.json", JSON.stringify(newData), function(err){
            if(err){
              return console.log(err);
            }
            console.log("搞掂");
          });

          
        });
    });
    // pdfParser.on('pdfParser_dataError', _.bind(_onPFBinDataError, self));

    pdfParser.loadPDF(__dirname + '/' + sampleFileName);

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
