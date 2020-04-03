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
    var spaceBtwQuotes = $("<li>");

    //L.C 4/1
    //get user translations from local storage
    var userTranslationsSavedArray = localStorage.getItem("userTranslations"); 

        //keep from erroring if no translations saved in local storage
        if (!userTranslationsSavedArray) {
                userTranslationsSavedArray = [];
            } else {
                userTranslationsSavedArray = JSON.parse(userTranslationsSavedArray);
            }

        //Add users quotes/translations into the modal and mobile div 
        for (i = 0; i < userTranslationsSavedArray.length; i++) {
            var spaceBtwQuotes = $("<li>");
            $("#translationsMobile").append(userTranslationsSavedArray[i]);
            $("#translationsMobile").append(spaceBtwQuotes);
            $("#translationsMobile").append(spaceBtwQuotes);
        }

        for (i = 0; i < userTranslationsSavedArray.length; i++) {
            var spaceBtwQuotes = $("<li>");
            $("#modalText").append(userTranslationsSavedArray[i]);
            $("#modalText").append(spaceBtwQuotes);
            $("#modalText").append(spaceBtwQuotes);
        }

    //L.C 4/1
    //error message for too many API requests, timer set for 1 hour
    function whoops() { 
        $("#translated").val(' ');
        $('#badRequestPopup').show();
        clearStyles();
        setTimeout(function(){ $('#badRequestPopup').hide();}, 3600000);
    }


    //L.C. 4/2
    //function to remove special fonts from translator area 
    function clearStyles() {
        $("#translated").removeClass("pirateFont");
        $("#translated").removeClass("cockneyFont");
        $("#translated").removeClass("cowboyFont");
        $("#translated").removeClass("oldEngFont");
        $("#translated").removeClass("chefFont");
    }


    //L.C. 4/2
    //Click button function to clear local storage 

    $('#clearQuotesBtn').click(function () {
        localStorage.clear();
    })
    // Initalize our site, we may tiurn this into a function to play some starting sound effects.

    //initalize();

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
            url: "https://favqs.com/api/qotd"

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
        clearStyles();
        var fullPirateURL = baseURL + pirateURL;
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullPirateURL);
        $('#translated').addClass("pirateFont");
        translatorCountFunction();
    });

    $("#cockneyTranslation").click(function () {
        clearStyles();
        var fullCockneyURL = baseURL + cockneyURL
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullCockneyURL);
        $('#translated').addClass("cockneyFont");
        translatorCountFunction();
    });

    $("#chefTranslation").click(function () {
        clearStyles();
        var fullChefURL = baseURL + chefURL;
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullChefURL);
        $('#translated').addClass("chefFont");
        translatorCountFunction();
    });

    $("oldEnglishTranslation").click(function () {
        clearStyles();
        var fullOldEnglishURL = baseURL + oldEnglishURL;
        randomQuote = $('#randomQuote').val();
        translateOurQuote(randomQuote, fullOldEnglishURL);
        $('#translated').addClass("oldEngFont");
        translatorCountFunction();
    });


    $("southernTranslation").click(function () {
        clearStyles();
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
            error: whoops
        }).then(function (response) {
            console.log(response);

            var translation = response.contents.translated
            var spaceBtwQuotes2 = $("<br>");
            
            //add quote onto the textarea 
            $("#translated").text(translation);

            //add quote into the modal on full web
            $("#modalText").append(translation);
            $("#modalText").append(spaceBtwQuotes2);

            //add quote into the row div on mobile
            $("#translationsMobile").append(translation);
            $("#translationsMobile").append(spaceBtwQuotes2);


            userTranslationsSavedArray.push(translation)
            localStorage.setItem("userTranslations", JSON.stringify(userTranslationsSavedArray));

            // After translation call the attributeSites function
            // This may need expanding with the type of translation performed
            // atrributedSites();
            translatePerformed = true;
        });
    }



    // function soundEffects() {
    //     console.log("Sounds Effects");
    // }
    // // This area is for the wierd funky functions that for some reason are not callable within document ready

    // function initialize() {
    //     // Play game start sound
    //     // playSFX()
    //     attributedSites();
    // }


    atrributedSites()

    function atrributedSites() {
        // This function will display the attribute links required for API access
        // EXS msaunders.eddie@outlook.com 28th March 2020
        // convertedType would be the pirate, cockney, yoda etc...
        // EXS requested two fields for these to be written to 30th March
        const funTranslationsAPI = '<a href="http://funtranslations.com" target="_blank">fun translations</a>';
        const quoteAPI = '<a href="https://favqs.com/" target="_blank" >fave quotes</a>';
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