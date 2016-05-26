//Login Function

$(document).ready(function() {
    $("#login").click(function() {
        var username = $("#username").val();
        console.log(username);
        location.href = "/pages/homepage.html"
    });

    // Variable to store your files
    
    $("#fileupload").on('change', prepareUpload);

    function prepareUpload(){
    	var files = $("#fileupload").val();
    }

});


var myapp = angular.module("mainApp", []);

myapp.directive("welcomediv", function() {
    return {
        restrict: "E",
        template: "<h1>Welcome to Share Print Portal</h1>"
    };
});
