$(document).ready(function(){
    $("#login").click(function(){
        var username = $("#username").val();
        console.log(username);
        location.href = "/pages/homepage.html"
    });
});

var app = angular.module("mainApp", []);

app.directive("welcomediv", function() {
    return {
        restrict: "E",
        template: "<h1>Welcome to Share Print Portal</h1>"
    };
});

