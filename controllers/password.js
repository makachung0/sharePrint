//Handling change password
var fs = require('fs');

module.exports = function(req, res) {
    var queryName = req.body.queryname;
    var oldPassword = req.body.querypassword;
    var newPassword1 = req.body.newpw;
    var newPassword2 = req.body.retypepw;

    console.log(req.body);

    // fs.readFile(__dirname + "/account.json", function read(err, data) {
    //     if (err) throw err;

    //     var dataObject = JSON.parse(data.toString());

    //     var found =
    //         for (var i = 0; i < dataObject.record.length; i++) {
    //             if (dataObject.record[i].username == queryName) {
    //                 return i;
    //             };
    //             console.log("i:" + i);
    //         }

    //     if (dataObject.record[found].password == querypassword) {
    //         if (newpw == retypepw) {
    //             dataObject.record[found].password = newpw;

    //             fs.writeFile(__dirname + "/account.json", JSON.stringify(dataObject), function(err) {
    //                 if (err) {
    //                     return console.log(err);
    //                 }
    //                 console.log("done");
    //             });
    //         } else {
    //             console.log("new passwords do not match");
    //         }
    //     } else {
    //         console.log("old password incorrect");
    //     }
    // })
}
