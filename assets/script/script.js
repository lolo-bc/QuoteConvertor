// Quote Convertor 
// JS Code 26th MArch 2020
// Eddie Saunders saunders.eddie@outlook.com
//
// This script is to accept input from the user then create an API call to convert
// the quote of the day selected by the user to a translation of their choice.

// Potential issues are the face we only have 5 hits per hour using funtranslations.com

// Version 1.00
// Simple input acceptance from user, then use translateOurQuote to display the translation
// EXS 26th MArch 2020

$(document).ready(function () {

    // part of materialize to make dropdown work 
    $('.dropdown-trigger').dropdown();

    //code from materialze to make modal trigger work 
    $('.modal').modal();

    const baseURL = "https://api.funtranslations.com/translate/"
    const cockneyURL = "cockney.json?text=";
    const pirateURL = "pirate.json?text=";

    const chefURL = "chef.json?text=";
    const oldEnglishURL = "oldenglish.json?text=";
    const southernURL = "southern-accent.json?text=";
    const gameStart = new Audio("./assets/sfx/gameStart.mp3");
    //const RIGHT_ANSWER = new Audio("./assets/sfx/rightAnswer.mp3");
    var randomQuote = ""
    var translationsPerHour = 5;


    // Initalize our site, we may tiurn this into a function to play some starting sound effects.
    // EXS 1st April 2020
    initPage();

    // T.W. 3/29
    // Function To Count Each Translate
    function translatorCountFunction() {
        if (translationsPerHour === 0) {
            countDown();
            return false;
        }
        else {
            translationsPerHour--;
            $("#translateCounter").text(translationsPerHour);
        }
    };

    // T.W. 3/30
    // Resets Translates To 5 After One Hour
    function countDown() {
        var counter = 3600;
        var oneHourCountDown = setInterval(function () {
            // console.log("CountDown: " + counter);
            counter--
            if (counter === 0) {
                clearInterval(oneHourCountDown);
                $("#translateCounter").text(5);
            }
        }, 1000);
    };

    $("#getRandomQuote").click(function () {
        playSFX(gameStart);
        $.ajax({
            url: "https://favqs.com/api/qotd",
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(randomQuote);
            randomQuote = (response.quote.body);
            $('#randomQuote').text(randomQuote);
        });
    });

    // These functions are tied into the menu system. After each translation
    // the code will automatically reduce one from the translation number
    // EXS added in Chef and Old English 30th March 2020.
    $("#pirateTranslation").click(function () {
        var fullPirateURL = baseURL + pirateURL;
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullPirateURL);
        $('#rand').addClass("pirateFont");
        translatorCountFunction();
    });

    $("#cockneyTranslation").click(function () {
        var fullCockneyURL = baseURL + cockneyURL
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullCockneyURL);
        $('#translated').addClass("cockneyFont");
        translatorCountFunction();
    });
    $("#chefTranslation").click(function () {
        var fullChefURL = baseURL + chefURL;
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullChefURL);
        $('#translated').addClass("chefFont");
        translatorCountFunction();
    });

    $("oldEnglishTranslation").click(function () {
        var fullOldEnglishURL = baseURL + oldEnglishURL;
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullOldEnglishURL);
        $('#translated').addClass("oldEngFont");
        translatorCountFunction();
    });

    $("southernTranslation").click(function () {
        var fullSouthernURL = baseURL + southernURL;
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullSouthernURL);
        $('#translated').addClass("cowboyFont");
        translatorCountFunction();
    });

    // This function allows us to pass the quote and create an API URL for fun translations
    //  EXS 27th March 2020
    // Adding random comment to test git push
    function translateOurQuote(randomQuote, translateURL) {
        //console.log (randomQuote, translateURL);
        myQuote = encodeURI(randomQuote);
        myURL = translateURL + myQuote;
        $.ajax({
            url: myURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $("#translated").text(response.contents.translated);

            //testing poping up the modal
            // $("#modalText").text(response.contents.translated);
            // $('#modal1').show();

            // After translation call the attributeSites function
            // This may need expanding with the type of translation performed
            // atrributedSites();
            translatePerformed = true;
        });

   
    }

 
    // This area is for the wierd funky functions that for some reason are not callable within document ready

    function initPage() {
        atrributedSites();
    }
    
    function atrributedSites() {
        // This function will display the attribute links required for API access
        // EXS msaunders.eddie@outlook.com 28th March 2020
        // convertedType would be the pirate, cockney, yoda etc...
        // EXS requested two fields for these to be written to 30th March
        var funTranslationsAPI = '<a href="http://funtranslations.com" target="_blank">fun translations</a>';
        var quoteAPI = '<a href="https://favqs.com/" target="_blank" >fave quotes</a>';
        attributeSites = 'Quotes supplied by ' + quoteAPI + '. Translation supplied by ' + funTranslationsAPI;
        // console.log (attributeSites);
        $("#attribute-site").html(attributeSites);
    }




    function playSFX(sfxName) {
        console.log("Playing sound effects!");
        sfxName.play();
    }
    // End of jquery ready function    
});


