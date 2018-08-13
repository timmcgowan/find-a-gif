/*
globals
*/

// Initial array of topics
var topics = ["georgia","football","movies", "food", "cats", "sports","fun"];
var rlimit = 10; //rate limit

// Function for displaying movie data
function renderButtons() {
    // Deleting the gtags prior to adding new gtags
    // (this is necessary otherwise we will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of gtags
    for (var i = 0; i < topics.length; i++) {
        // Then dynamicaly generating buttons for each movie in the array
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of movie to our button
        a.addClass("tag");
        // Adding a data-attribute
        a.attr("data-name", topics[i]);
        // Providing the initial button text
        a.text(topics[i]);
        // Adding the button to the HTML
        $("#buttons-view").append(a);
    }
}

function Cards(resp) {
    console.log(resp);
    // storing the data from the AJAX request in the results variable
    var results = resp.data;

    // Looping through each result item
    for (var i = 0; i < results.length; i++) {
        // Creating and storing a div tag
        let gifDiv = $("<div class='gifwrap'>");
        let gifCard = $("<div class='gifdiv Card h-100'>");

        // Creating a paragraph tag with the result item's rating
        var p = $("<p>").text("Rating: " + results[i].rating);

        // Creating and storing an image tag
        let gifImage = $("<img class='gif img-fluid img-thumbnail'>");
        // Setting the src attribute of the image to a property pulled off the result item
        gifImage.attr("src", results[i].images.fixed_width_still.url);
        gifImage.attr("data-still", results[i].images.fixed_width_still.url);
        gifImage.attr("data-animate", results[i].images.fixed_width.url);
        gifImage.attr("data-state","still");
        gifImage.attr("alt", "Test Alt");

        // Appending the paragraph and image tag to the animalDiv
        gifDiv.append(gifCard);
        gifCard.append(gifImage);
        gifCard.append(p);

        // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
        $("#gifs-appear-here").prepend(gifDiv);
    }
}

// Generic function for capturing the name from the data-attribute
function renderCards(tg) {
    let tagName; 
    if (tg){
        tagName = tg;
    }else{
        tagName = $(this).attr("data-name");
    }
    console.log(tagName);

    // Constructing a queryURL using the animal name
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    tagName + "&api_key=dc6zaTOxFJmzC&limit=" + rlimit;

    // Performing an AJAX request with the queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // After data comes back from the request
    .then(function (response) {
        console.log(queryURL);
        Cards(response);
    });
}

function changeState(){
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        } else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }    
}
function renderInitial(){
    let ki = Math.floor(Math.random() * topics.length);  
    renderCards(topics[ki]);// display random gifs from topics
}
$(document).ready(function () {
    $("#addtag").click(function (e) {
        e.preventDefault();
        // hide all submenus first
        console.log("Clicked add");

        // This line grabs the input from the textbox
        var tag = $("#tag-input").val().trim();

        // Adding the movie from the textbox to our array
        topics.push(tag);

        // Calling renderButtons which handles the processing of our movie array
        renderButtons();
    });
});

// Function for displaying the GIF cards
// We're adding a click event listener to all elements with the class "tag"
// We're adding the event listener to the document because it will work for dynamically generated elements
// $(".tags").on("click") will only add listeners to elements that are on the page at that time
$(document).on("click", ".tag", renderCards);
$(document).on("click",".gif", changeState);

// Calling the renderButtons function to display the intial buttons
$(document).ready(renderButtons);
$(document).ready(renderInitial); // display random gifs from topics