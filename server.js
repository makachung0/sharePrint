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

//search
app.post('/search', function(req, res) {
    var queryname = req.body.queryname;
    readFile(function(dataObject) {
        var found = findUser(queryname, dataObject);
        if (typeof(found) != "undefined") {
            var history = dataObject.record[found].history;
            res.send(history);
        } else {
            res.send('user-not-found');
        };
    });
});

//upload file
app.post('/upload', function(req, res) {
    var tempFile = req.files.file;
    var tempName = req.body.name;

    if (typeof(tempName) == "undefined") {
        return res.send('not-user');
    }

    if (!req.files) {
        res.send('no-file');
        return;
    }

    writeFile(tempFile.data, "/public/temp/" + tempFile.name, function() {
        printItem(tempFile.name, tempName);
        res.send('print');
    });

});

app.post('/adduser', function(req, res) {
    var addname = req.body.addname;

    readFile(function(dataObject) {

        for (var i = 0; i < dataObject.record.length; i++) {
            if (addname == dataObject.record[i].username) {
                return res.send("duplicate");
            }
        }

        var packet = {};
        packet.username = addname;
        packet.history = [];
        packet.password = new Date().getTime().toString();
        packet.credit = 0;
        dataObject.record.push(packet);

        writeFile(JSON.stringify(dataObject), "/account.json", function() {
            res.send(packet.password);
        });

    });

});

app.post('/paid', function(req, res) {
    var paidname = req.body.paidname;

    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }
        var dataObject = JSON.parse(data.toString());
        var found = findUser(paidname, data);
        if (typeof(found) != "undefined") {
            dataObject.record[found].history = [];
            console.log("history cleared");

            fs.writeFile(__dirname + "/account.json", JSON.stringify(dataObject), function(err) {
                if (err) {
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
    var fileExt = path.extname(filename);

    if (fileExt != '.pdf') {
        return res.send('not-pdf');
    }
    // printer setting
    // var printer = new Printer('FX_DocuPrint_P265_dw');
    // var jobFromFile = printer.printFile(__dirname+"/public/temp/"+filename);

    var now = new Date().toString();
    var pdfParser = new PDFParser();
    pdfParser.loadPDF(__dirname + '/public/temp/' + filename);
    console.log(filename);


    pdfParser.on('pdfParser_dataReady', function(pdfData) {
        console.log(pdfData.formImage.Pages.length);

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

function writeHistory(username) {

}

function findUser(queryname, dataObject) {
    // console.log("queryname: " + queryname);
    for (var i = 0; i < dataObject.record.length; i++) {
        if (dataObject.record[i].username == queryname) {
            return i;
        }
        console.log("i:" + i);
    }
}

function readFile(callback) {
    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }
        var dataObject = JSON.parse(data.toString());
        callback(dataObject);
    });

}

function writeFile(data, dir, callback) {
    fs.writeFile(__dirname + dir, data, function(err) {
        if (err) {
            return console.log(err);
        }
        callback();
    })
}

app.post('/changepw', function(req, res) {
    var queryname = req.body.queryname;
    var querypassword = req.body.querypassword;
    var newpw = req.body.newpw;
    var retypepw = req.body.retypepw;

    console.log(querypassword);
    console.log(newpw);
    console.log(retypepw);

    fs.readFile(__dirname + "/account.json", function read(err, data) {
        if (err) {
            throw err;
        }
        var dataObject = JSON.parse(data.toString());
        var found = findUser(queryname, data);
        if (dataObject.record[found].password == querypassword) {
            if (newpw == retypepw) {
                dataObject.record[found].password = newpw;

                fs.writeFile(__dirname + "/account.json", JSON.stringify(dataObject), function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("done");
                });
            } else {
                console.log("new passwords do not match");
            }
        } else {
            console.log("old password incorrect");
        }
    })
});

//Structure of server.js
//only do stuffs on redirection and parse the request to controllers
//in order to simplify server.js
//all the server side controllers will be put into a dir calle controllers/

//root access
// app.get('/', function(req, res){
//     //As node js auto find index.html, this function may not be useful
//     require('controllers/loginController.js')(req, res);
// });

//login function
app.post('/login', function(req, res) {
    require('./controllers/loginController.js')(req, res);
});






//create server on port 3000
app.server = http.createServer(app);
app.server.listen(3000);
console.log("Starting Server at Localhost:3000");