buttonsLoadedFromStorage = false; // affects behavior of buttonGenerator() when page is loaded

var url = "http://openweathermap.org/img/w/10d.png";

//fetch(url).then(response, function())

var loadButtons = function() { // loads buttons from previous sesh
    var numberOfButtons = localStorage.getItem("number-of-buttons");

    if (!numberOfButtons) { // if there were no buttons from previous sesh, kill function
        buttonsLoadedFromStorage = true;
        return;
    }

    for (var i = 0; i < numberOfButtons; i++) { // pull button text from localStorage and create buttons
        buttonGenerator(localStorage.getItem(i));
    }

    buttonsLoadedFromStorage = true;
}

var saveCurrentCity = function(inputText) {
    localStorage.setItem("current-city", inputText);
}

var saveButtons = function(currentButtons) {
    for (var i = 0; i < currentButtons.length; i++) { // save currentButtons array to localStorage
        localStorage.setItem("number-of-buttons", currentButtons.length); // remeber how many buttons there are
        localStorage.setItem(i, currentButtons[i].innerText); // record buttons
    }
}

var getWeather = function() {
    console.log(localStorage.getItem("current-city"));
}

var buttonGenerator = function(inputText) { // adds a button to the page for searched city if it is not already added
    var citySelectorEl = document.querySelector(".city-selector");
    currentButtons = citySelectorEl.children;

    if (buttonsLoadedFromStorage === true){ // this check does not need to run if buttons are still loading from storage
        for (var i = 0; i < currentButtons.length; i++) { // if the button has already been created, do not create another
            if (inputText === currentButtons[i].innerText) {
                return;
            }
        }
}

    var newButton = document.createElement("button"); // logic to add button of searched city
    newButton.innerText = inputText;
    citySelectorEl.appendChild(newButton);

    if (buttonsLoadedFromStorage === true) { 

        currentButtons = citySelectorEl.children; // update currentButtons array to prepare to save to localStorage

        for (var i = 0; i < currentButtons.length; i++) { // save currentButtons array to localStorage
            localStorage.setItem("number-of-buttons", currentButtons.length); // remeber how many buttons there are
            localStorage.setItem(i, currentButtons[i].innerText); // record buttons
        }
    }


}

loadButtons();
getWeather();

var searchButtonHandler = function(event) {
   
    inputText = event.target.parentElement.firstElementChild.value; // upon button click, record text in input field

    saveCurrentCity(inputText);
    buttonGenerator(inputText);
    getWeather(inputText);
}

var historyButtonHandler = function(event) {

    if (event.target.tagName === "DIV") { // kill function if user has missed the history buttons and just clicked the div
        return;
    }

    saveCurrentCity(event.target.innerText); // set current-city in localStorage so getWeather can pull it

    getWeather();

}


var searchButtonEl = document.querySelector(".search-button");
searchButtonEl.addEventListener("click", searchButtonHandler);

var citySelectorEL = document.querySelector(".city-selector");
citySelectorEL.addEventListener("click", historyButtonHandler);