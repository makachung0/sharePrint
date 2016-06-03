//Controller For index.html

$(document).ready(function() {

    //Login Function
    $("#login").click(function() {
        var username = $("#username").val();
        var password = $("#password").val();
        localStorage.setItem("username", username);
        $.post("/login", { "username": username, "password": password }, function(result) {
            console.log(result);
            if (result == "ok") {
                location.href = "/pages/homepage.html"
            } else if (result == "fail") {
                alert("Invalid Username");
            } else {
                alert("Server Error");
            }
        });

    });




});
