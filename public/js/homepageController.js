//homepageController
// var fs = require("fs");

$(document).ready(function() {

    //get Username to send to server
    // $("#name").val(localStorage.getItem("username"));

    //Homepage Welcome Message
    $("#title").html("Hi, " + localStorage.getItem("username"));

    //get History
    var username = localStorage.getItem("username");
    $.post("/search", { "queryname": username }, function(result) {
        console.log(result);

        if (result != "undefined") {
            for (var i = 0; i < result.length; i++) {
                $("#history").append('<tr><td>' + result[i].date + '</td><td>' + result[i].filename + '</td><td>' + result[i].fee + '</td></tr>');

            }

        }
    });

    $("#gotoPrint").click(function() {
        console.log('gotoPrint');


        $("#fileinput").css("visibility", "visible");


            // location.href = "/pages/personal.html"
    });

    $("#name").val(localStorage.getItem("username"));

    $("#changePassword").click(function() {
        console.log('changePassword');

        var e = document.getElementById("passwordinput");
        if(e.style.visibility == 'hidden')
            e.style.visibility = 'visible';
        else
            e.style.visibility = 'hidden';
    })
});

function changePw(){
    var username = localStorage.getItem("username");

    // get html form values
    var oldpw = document.getElementById("oldpw").value;
    var newpw = document.getElementById("newpw").value;
    var retypepw = document.getElementById("retypepw").value;

    $.post("/changepw", { 
            "queryname": username, 
            "querypassword": oldpw, 
            "newpw": newpw,
            "retypepw": retypepw
        }, function(result) {
            console.log("password changed");
            console.log(result);
        });

    var e = document.getElementById("pwmessage");
    e.style.visibility = 'visible';
}