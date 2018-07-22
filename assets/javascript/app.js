//hide non input fields on window load
window.onload = function(){
	
	$("#names-view").hide();
}

$("document").ready(function() {
   // array with some names from Eiffel Tower listed in Wikipedia
    var names = [
        "Antoine Lavoisier", "Henri Tresca", "Jean-Victor Poncelet", "Joseph-Louis Lagrange", "Georges Cuvier"
    ];
    //**********************using local storage to render new buttons */
    var tasksButtons = JSON.parse(localStorage.getItem("tasksButtons")) || [];
    renderButtonsP();
    function renderTasksButtons() {
        $("#name-view-add").empty();
        for (var i = 0; i < tasksButtons.length; i++) {
           // var toDoTask = tasksButtons[i];
            var btn = $('<button class="btn btn-raised btn-info name-btn">');
            btn.attr("data-name", tasksButtons[i]);
            btn.text(tasksButtons[i]);
            $("#name-view-add").append(btn);
        }
    }

    function displaynameInfo() {
        var name = $(this).attr("data-name");
        //var queryURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + name + "&callback=?";
        // Creating an AJAX call for the specific name button being clicked
        $.ajax({
            type: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + name + "&callback=?",
            // a callback parameter: callback=? added to resolve an error : Access-Control-Allow-Origin ( access being blocked by the Same-origin policy)
            dataType: "json",
            success: function(data) {
                var output = data.parse.text["*"];
                var html = $('<div></div>').html(output);
                console.log("information : " + output);
  
                // remove links due to they are not wokring (used jQuery method)
                html.find('a').each(function() { $(this).replaceWith($(this).html()); });
  
                //remove references( The <sup> tag that defines superscript text. )
                html.find('sup').remove();
  
                // remove cite error due to some of the articles has it on the bottom
                html.find('.mw-ext-cite-error').remove();
              
               $("#names-view").fadeIn(1000);
               $('#names-view').html($(html).find('p'));
            },
            error: function(errorMessage) {}
        });
  
    };

    // Function for displaying posters data
    function renderButtonsP() {
        // Deleting the names prior to adding new names
        // (this is necessary otherwise you will have repeat buttons)
        $("#buttons-view").empty();
        // Looping through the array of names
        for (var i = 0; i < names.length; i++) {
            // Then dynamicaly generating buttons for each name in the array
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            var a = $("<button class='btn btn-raised btn-info name-btn'>");
            // Adding a class of name-btn to our button
            a.addClass("name-btn");
            // Adding a data-attribute
            a.attr("data-name", names[i]);
            // Providing the initial button text
            a.text(names[i]);
            // Adding the button to the buttons-view div
            $("#buttons-view").append(a);
        }
    };

    // to display all buttons on the top of the page
    renderTasksButtons();

    // button to add name
    $("#add-name").on("click", function(event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var name = $("#name-input").val().trim();
        //check if anything typed by user into the add field to prevent adding an empty button
        if (name == 0) {
            var alertMes = $("<p id ='alert' class='alert alert-danger alert-dismissible close' data-dismiss='alert' aria-label='close' role='alert'>" + "Please Enter the Name." + "&nbsp&nbsp&times" + "<p/>");
            $("#name-form").prepend(alertMes) // console.log(alertMes);
        } else {
            // Adding name from the textbox to our array
            names.push(name);
            tasksButtons.push(name);
            localStorage.setItem("tasksButtons", JSON.stringify(tasksButtons));

            console.log(tasksButtons);
            console.log(names);
        }
        //empty input field
        $("#name-input").val("");
        // Calling renderButtons which handles the processing of our name array
        renderTasksButtons();
    });

    // display engineer information 
    $(document).on("click", ".name-btn", displaynameInfo);


});
