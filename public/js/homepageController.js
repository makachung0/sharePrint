//homepageController

$(document).ready(function() {

	// function loadname(){
	// 	console.log(localStorage.getItem("username"));
	// 	return localStorage.getItem("username");
	// }
	$("#name").val(localStorage.getItem("username"));
    //Homepage Welcome Message
    $("#title").html("Hi, " + localStorage.getItem("username"));


    

});
