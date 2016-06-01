//global variable


//Welcome Div
var myapp = angular.module("mainApp", []);

myapp.directive("welcomediv", function() {
    return {
        restrict: "E",
        template: "<h1>Welcome to Share Print Portal</h1>"
    };
});

$(document).ready(function() {
	//Login Function
    $("#login").click(function() {
        var username = $("#username").val();
        localStorage.setItem("username", username);
        $.post("/login", {"username": username}, function(result){
            console.log(result);
            if(result =="ok"){
            	location.href = "/pages/homepage.html"
            }
            else if(result =="fail"){
            	alert("Invalid Username");
            }
            else{
            	alert("Server Error");
            }
        });
        
    });

    //Homepage
	$("#title").html("Hi, "+localStorage.getItem("username"));

	
	
});

