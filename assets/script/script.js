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
    const fuddURL = baseURL + 'fudd.json?text=';
    const piratesAudio = new Audio('./assets/sfx/pirates.mp3');
    const cockneyAudio = new Audio('./assets/sfx/cockney.mp3');
    const chefAudio = new Audio('./assets/sfx/chef.mp3');
    const oldEnglandAudio = new Audio('./assets/sfx/oldEnglish.mp3');
    const fuddAudio = new Audio('./assets/sfx/fudd.mp3');

    var lockedOut = false;
    var randomQuote = ''
    var translationsPerHour = 5;
    var spaceBtwQuotes = $('<li>');
    var currentTime = moment().format("H");
    var storedTime = localStorage.getItem("limitTime");

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
        lockedOut = true;
        
        console.log("Error with pulling translation");
        $('#badRequestPopup').show();
        //clearStyles();
        // $('#translated').text("Error! Abort! Abort!");
        setTimeout(function () { 
            $('#badRequestPopup').hide(); }, 5000); // this was 3600000
            console.log ("Timeout complete");
            console.log (lockedOut);
            lockedOut = false;
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

    // T.W. Check time before display
    function checkTimeBeforeDisplayingIt() {
        if (currentTime - storedTime < 1) {
            $('#translateCounter').text(0);
        }
    }

    checkTimeBeforeDisplayingIt()

    // T.W. Checks time to see if it's been over an hour since last translates ran out
    function checkTimeBeforeCountingTranslate() {
        if (currentTime - storedTime >= 1) {
            countOurTranslate();
        }
        else {
            $('#translateCounter').text(0);
        }
    };

    // T.W. 3/29
    // Function To Count Each Translate
    function countOurTranslate() {

        if (translationsPerHour === 0) {
            localStorage.setItem("limitTime", currentTime);
            countDown();
            return false;
        }

        else {
            translationsPerHour--;
            $('#translateCounter').text(translationsPerHour);
        }
    };

    randomQuote = $('#randomQuote').val();

    $('#getRandomQuote').click(function () {
        //$('#translated').empty();
        $.ajax({
            url: 'https://favqs.com/api/qotd',
            method: 'GET'
        }).then(function (response) {
            randomQuote = (response.quote.body);
            $('#randomQuote').text(randomQuote);
        });
    });

    // clear our random quote on click
    $('#randomQuote').click(function () {
        $('#randomQuote').empty();
        $('#translated').empty();
    });

    // Check on which list item has been clicked on the dropdown
    // Then call the translatefunction with appropriate parameters  
    $('#dropdown1 li').click(function () {
        // console.log(this.id);
        switch (this.id) {
            case 'pirateTranslation':

                translateOurQuote(pirateURL, 'pirateFont', piratesAudio);
                break;
            case 'cockneyTranslation':
                translateOurQuote(cockneyURL, 'cockneyFont', cockneyAudio);
                break;
            case 'chefTranslation':
                translateOurQuote(chefURL, 'chefFont', chefAudio);
                break;
            case 'oldEnglishTranslation':
                translateOurQuote(oldEnglishURL, 'oldEngFont', oldEnglandAudio);
                break;
            case 'fuddTranslation':
                translateOurQuote(fuddURL, 'cowboyFont', fuddAudio)
                break;
            default:
                break;
        }
    })

    // function translateOurQuote(randomQuote, translateURL, fontType) {
    function translateOurQuote(translateURL, fontType, audioFile) {
        // Clear any existing CSS font styles.
        //clearStyles();
        // Add our new CSS font style class.

        // We maybe able to squish the myQuote calculation directly into the myURL calculation
        myQuote = encodeURI($('#randomQuote').val());
        myURL = translateURL + myQuote;

        // T.W. 4/4 Check time to see if we can count this translate or we have to wait an hour
        checkTimeBeforeCountingTranslate();

        $.ajax({
            url: myURL,
            method: 'GET',
            error: whoops
        }).then(function (response) {
            console.log("Translate our text");
            playSFX(audioFile);
            // Get our returned translation, set the translated font and display
            //$('#translated').addClass(fontType);
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
        });
    }

    // Initialize our page, created as a funciton in case we need to do something else in future
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
        sfxName.play();
    }
    // End of jquery ready function    
});
