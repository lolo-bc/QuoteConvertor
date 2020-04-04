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

    const baseURL = 'https://api.funtranslations.com/translate/'
    const cockneyURL = baseURL + 'cockney.json?text=';
    const pirateURL = baseURL + 'pirate.json?text=';
    const chefURL = baseURL + 'chef.json?text=';
    const oldEnglishURL = baseURL + 'oldenglish.json?text=';
    const southernURL = baseURL + 'southern-accent.json?text=';
    const gameStart = new Audio('./assets/sfx/gameStart.mp3');

    var randomQuote = ''
    var translationsPerHour = 5;
    var spaceBtwQuotes = $('<li>');

    //L.C 4/1
    //get user translations from local storage
    var userTranslationsSavedArray = localStorage.getItem('userTranslations');

    //keep from erroring if no translations saved in local storage
    if (!userTranslationsSavedArray) {
        userTranslationsSavedArray = [];
    } else {
        userTranslationsSavedArray = JSON.parse(userTranslationsSavedArray);
    }

    //Add users quotes/translations into the modal and mobile div 
    for (i = 0; i < userTranslationsSavedArray.length; i++) {
        var spaceBtwQuotes = $('<li>');
        $('#translationsMobile').append(userTranslationsSavedArray[i]);
        $('#translationsMobile').append(spaceBtwQuotes);
        $('#translationsMobile').append(spaceBtwQuotes);
    }

    for (i = 0; i < userTranslationsSavedArray.length; i++) {
        var spaceBtwQuotes = $("<li>");
        $('#modalText').append(userTranslationsSavedArray[i]);
        $('#modalText').append(spaceBtwQuotes);
        $('#modalText').append(spaceBtwQuotes);
    }

    //L.C 4/1
    //error message for too many API requests, timer set for 1 hour
    function whoops() {
        $('#translated').val(' ');
        $('#badRequestPopup').show();
        clearStyles();
        setTimeout(function () { $('#badRequestPopup').hide(); }, 3600000);
    }

    //L.C. 4/2
    //function to remove special fonts from translator area 
    function clearStyles() {
        $('#translated').removeClass();
    }

    //L.C. 4/2
    //Click button function to clear local storage 
    $('#clearQuotesBtn').click(function () {
        localStorage.clear();
        $('modal1').hide();
        location.reload(true);
    })

    // EXS 1st April 2020 - Page initalize
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
            $('#translateCounter').text(translationsPerHour);
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
                $('#translateCounter').text(5);
            }
        }, 1000);
    };


    $('#getRandomQuote').click(function () {
        $.ajax({
            url: 'https://favqs.com/api/qotd',
            method: 'GET'
        }).then(function (response) {
            //console.log(response);
            //console.log(randomQuote);
            randomQuote = (response.quote.body);
            $('#randomQuote').text(randomQuote);
        });
    });

    // clear our random quote on click
    $('#randomQuote').click(function () {
        $('#randomQuote').empty();
    });

    // These functions are tied into the menu system. After each translation
    // the code will automatically reduce one from the translation number
    // EXS added in Chef and Old English 30th March 2020.
    // Here we'll check for the dropdown-content class being click then pass over a parameter to a function

    $('#dropdown1 li').click(function () {
        console.log(this.id);
        switch (this.id) {
            case 'pirateTranslation':
                translateOurQuote (pirateURL,'pirateFont');
                break;
            case 'cockneyTranslation':
                translateOurQuote (cockneyURL,'cockneyFont');
                break;
            case 'chefTranslation':
                translateOurQuote (chefURL, 'chefFont');
                break;
            case 'oldEnglishTranslation':
                translateOurQuote (oldEnglishURL, 'oldEngFont')
                break;
            case 'southernTranslation':
                translateOurQuote (southernURL, 'cowboyFont')
                break;
            default:
                break;
        }
    })

    // function translateOurQuote(randomQuote, translateURL, fontType) {
    function translateOurQuote (translateURL, fontType) {
        // Clear any existing CSS font styles.
        clearStyles();
        // Add our new CSS font style class.
        $('#translated').addClass(fontType);
        myQuote = encodeURI($('#randomQuote').val());
        //console.log ("Quote To Translate: ", myQuote);
        // myQuote = encodeURI(randomQuote);
        myURL = translateURL + myQuote;
        console.log ('translate url: ', myURL);
        $.ajax({
            url: myURL,
            method: 'GET',
            error: whoops
        }).then(function (response) {
            //console.log(response);
            var translation = response.contents.translated

            var spaceBtwQuotes2 = $("<br>");

            //add quote onto the textarea do
            $("#translated").text(translation);

            //add quote into the modal on full web
            $("#modalText").append(translation);
            $("#modalText").append(spaceBtwQuotes2);

            //add quote into the row div on mobile
            $("#translationsMobile").append(translation);
            $("#translationsMobile").append(spaceBtwQuotes2);

            userTranslationsSavedArray.push(translation)
            localStorage.setItem('userTranslations', JSON.stringify(userTranslationsSavedArray));
            translatePerformed = true;
        });
    }

    function initPage() {
        atrributedSites();
    }

    function atrributedSites() {
        // This function will display the attribute links required for API access
        var funTranslationsAPI = '<a href="http://funtranslations.com" target="_blank">fun translations</a>';
        var quoteAPI = '<a href="https://favqs.com/" target="_blank" >fave quotes</a>';
        attributeSites = 'Quotes supplied by ' + quoteAPI + '. Translation supplied by ' + funTranslationsAPI;
        $('#attribute-site').html(attributeSites);
    }

    function playSFX(sfxName) {
        //console.log('Playing sound effects!');
        sfxName.play();
    }
    // End of jquery ready function    
});
