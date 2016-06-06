//Controller For index.html

$(document).ready(function() {

    //Login Function
    $("#login").click(function() {
        console.log('i clicked');
        var username = $("#username").val();
        var password = $("#password").val();
        localStorage.setItem("username", username);
        $.post("/login", { "username": username, "password": password }, function(result) {
            
            if (result == "ok") {
                location.href = "/pages/homepage.html"
            } else if (result == "fail") {
                alert("Invalid Username");
            } else if (result == "admin"){
                location.href = "/pages/admin.html"
                localStorage.setItem("admin", "ok");
            }else {
                alert("Server Error");
            }
        });

    });

   
});

function donothing(){};
