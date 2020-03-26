// Quote Convertor 
// JS Code 26th MArch 2020
// Eddie Saunders saunders.eddie@outlook.com
//
// This script is to accept input from the user then create an API call to convert
// the quote of the day selected by the user to a translation of their choice.

// Potential issues are the face we only have 5 hits per hour using funtranslations.com



// Version 1.00
// Simple input acceptance from user


$(document).ready(function () {

    const cockneyURL="https://api.funtranslations.com/translate/cockney.json?text=";
    var randomQuote = ""

    $("#getRandomQuote").click(function () {
        console.log ("Getting a random Quote");
        $.ajax ({
            url: "https://favqs.com/api/qotd"
            //method: "GET"
        }) .then (function (response) {
            console.log (response);
            randomQuote = (response.quote.body);
            //console.log (randomQuote);
            $('#randomQuote').text(randomQuote);
        });
        
        $("#pirateTranslation").click(function () {
            console.log ("Pirate Selected");
        })
            
        $("#cockneyTranslation").click(function () {
            console.log ("Cockney Translation");
            console.log (cockneyURL);
            var fullCockneyURL=cockneyURL+randomQuote;
            console.log (fullCockneyURL);
            // https://api.funtranslations.com/translate/cockney.json?text=I%27m%20little%20busy%20with%20the%20bike%2C%20but%20I%20love%20to%20eat%20the%20food.
            $.ajax ({
                url: fullCockneyURL
            }) .then (function (response) {
                console.log(response);
                console.log(response.contents.translated);
                $("#translated").text(response.contents.translated);
            })
        })
    

    });



















// End of jquery ready function    
});