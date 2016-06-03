//homepageController

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

    

});
