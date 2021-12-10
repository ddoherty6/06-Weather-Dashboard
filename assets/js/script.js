buttonsLoadedFromStorage = false; // affects behavior of buttonGenerator() when page is loaded

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

var getLatLon = function() {
    console.log(localStorage.getItem("current-city"));
    var currentCity = localStorage.getItem("current-city");

    todayURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=33b7f578b3569767fb31590e23e0cec1";

    fetch(todayURL).then(function(response) {

        response.json().then(function(data) {

            var lat = data.coord.lat;
            var lon = data.coord.lon;

            console.log(lat);
            console.log(lon);
            
            getWeather(currentCity, lat,lon);
        });
    });

    
}

var getWeather = function(currentCity, lat, lon) {

    forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exlcude=current,min&appid=33b7f578b3569767fb31590e23e0cec1";

    fetch(forecastURL).then(function(response) {

        response.json().then(function(data) {
            console.log(data);
            var date = data.current.dt;
            var icon = data.current.weather[0].icon;
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var UVindex = data.current.uvi

            drawTodayWeather(currentCity, date, icon, temp, wind, humidity, UVindex);
            drawForecast(data.daily); // pass array to the drawForecast() function
        });
    });
}

var drawTodayWeather = function(city, date, icon, temp, wind, humidity, UVindex) {
    console.log(city);
    console.log(date);
    console.log(icon);
    console.log(temp);
    console.log(wind);
    console.log(humidity);
    console.log(UVindex);



}

var drawForecast = function(forecast) {
    console.log(forecast);



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
getLatLon();

var searchButtonHandler = function(event) {
   
    inputText = event.target.parentElement.firstElementChild.value; // upon button click, record text in input field

    saveCurrentCity(inputText);
    buttonGenerator(inputText);
    getLatLon(inputText);
}

var historyButtonHandler = function(event) {

    if (event.target.tagName === "DIV") { // kill function if user has missed the history buttons and just clicked the div
        return;
    }

    saveCurrentCity(event.target.innerText); // set current-city in localStorage so getLatLon can pull it

    getLatLon();

}


var searchButtonEl = document.querySelector(".search-button");
searchButtonEl.addEventListener("click", searchButtonHandler);

var citySelectorEL = document.querySelector(".city-selector");
citySelectorEL.addEventListener("click", historyButtonHandler);