//homepageController

$(document).ready(function() {

    //modal variables
    var newJobModal = document.getElementById('newJobModal');
    var span = document.getElementsByClassName("close")[0];
    var passwordModal = document.getElementById('passwordModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        console.log(event.target);
        if (event.target == newJobModal) {
            newJobModal.style.display = "none";
        }
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        newJobModal.style.display = "none";
    }

    //get Username to send to server

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

    //Create Print Job
    $("#newJob").click(function() {
        newJobModal.style.display = "block";

        // $("#input").unbind().click().change(function(e) {
        //     console.log('file changed');
        //     $("#fileinput").css("visibility", "visible");

        // });

    });

    $("#historyBtn").click(function() {
        // modal.style.display = "block";
    });



    $("#name").val(localStorage.getItem("username"));

    $("#changePassword").click(function() {
        console.log('changePassword');
        passwordModal.style.display = 'block';

        var e = document.getElementById("passwordinput");
        if (e.style.visibility == 'hidden')
            e.style.visibility = 'visible';
        else
            e.style.visibility = 'hidden';
    })
});

function changePw() {
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
