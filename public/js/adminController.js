//adminController.js

$(document).ready(function() {
    //Login Function
    $("#search").click(function() {
        var username = $("#username").val();
        localStorage.setItem("queryname", username);
        $.post("/search", { "queryname": username }, function(result) {
            console.log(result);

            if (result != "undefined") {
                for (var i = 0; i < result.length; i++) {
                    $("#history").append('<tr><td>'+result[i].date+'</td><td>'+result[i].filename+'</td><td>'+result[i].fee+'</td></tr>');

                }

            }
        });
    });

});
