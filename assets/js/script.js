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

var getLatLon = function(currentCity) { // uses /weather endpoint to get lat and lon for given city, feeds to getWeather() func

    todayURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=33b7f578b3569767fb31590e23e0cec1";

    fetch(todayURL).then(function(response) {
        if(response.status === 200) { // check if searched city returned a result
            response.json().then(function(data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                getWeather(currentCity, lat,lon);
            });
        } else { // if city does not exit, exit process, alert user
            alert("There was a server error. Please check the spelling of the city you entered.");
        }
    });    
}

var getWeather = function(currentCity, lat, lon) { // uses lat and lon from getLatLon() to access /onecall endpoint

    forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=33b7f578b3569767fb31590e23e0cec1";

    fetch(forecastURL).then(function(response) {

        response.json().then(function(data) {
            
            var date = data.current.dt;
            var icon = data.current.weather[0].icon;
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var UVindex = data.current.uvi

            drawTodayWeather(currentCity, date, icon, temp, wind, humidity, UVindex); // send groomed data to drawTodayWeather()
            drawForecast(data.daily); // pass array to the drawForecast() function
        });
    });

    saveCurrentCity(currentCity);
    buttonGenerator(currentCity);

}

var drawTodayWeather = function(city, date, icon, temp, wind, humidity, UVindex) { //assign info to 'today' section

    var cityDateEl = document.querySelector("#today-city-date");
    cityDateEl.innerText = city  + " (" + formatDate(date) + ")";

    var iconEl = document.querySelector("#today-icon");
    iconEl.innerHTML = "<img src='https://openweathermap.org/img/w/" + icon + ".png'>";

    var tempEl = document.querySelector("#today-temp");
    tempEl.innerText = temp + "°F";

    var windEl = document.querySelector("#today-wind");
    windEl.innerText = wind + " MPH";

    var humidityEl = document.querySelector("#today-humidity");
    humidityEl.innerText = humidity + " %";

    var UVindexEL = document.querySelector("#today-UVindex");
    UVindexEL.innerText = UVindex;
    setUVcolor(UVindex, UVindexEL); // sets css class of UVindexEl
}

var drawForecast = function(forecast) { // assign info to the forecast articles

    fiveDayEl = document.querySelector("#five-day"); // select entire forecast div
    forecastArticles = fiveDayEl.children; // create array of forecast articles
    var date = 0;
    var icon = "";
    var temp = 0;
    var wind = 0;
    var humidity = 0;
    var UVIndex = 0;
    
    for (var infoIndex = 0; infoIndex < 5; infoIndex++) { 
        for (var dayIndex = 0; dayIndex < forecastArticles.length; dayIndex++) {

            date = forecast[dayIndex+1].dt; // forecast[0] is current day, we need the five days after current day
            
            (forecastArticles[dayIndex].children)[infoIndex].innerText = formatDate(date); // cycle through the date child elements of each forecast article
        }
        infoIndex++;

        for (var dayIndex = 0; dayIndex < forecastArticles.length; dayIndex++) { // same process as before, but now drawing info to the icon elements

            icon = forecast[dayIndex+1].weather[0].icon;

            (forecastArticles[dayIndex].children)[infoIndex].setAttribute("src", "https://openweathermap.org/img/w/" + icon + ".png");
        }
        infoIndex++;

        for (var dayIndex = 0; dayIndex < forecastArticles.length; dayIndex++) { // temperature elements

            temp = forecast[dayIndex+1].temp.day;

            (forecastArticles[dayIndex].children)[infoIndex].innerText = "Temp: " + temp +" °F";
        }
        infoIndex++;

        for (var dayIndex = 0; dayIndex < forecastArticles.length; dayIndex++) { // wind elements

            wind = forecast[dayIndex+1].wind_speed;

            (forecastArticles[dayIndex].children)[infoIndex].innerText = "Wind: " + wind + " MPH";
        }
        infoIndex++;

        for (var dayIndex = 0; dayIndex < forecastArticles.length; dayIndex++) { // humidity elements

            humidity = forecast[dayIndex].humidity;

            (forecastArticles[dayIndex].children)[infoIndex].innerText = "Humidity: " + humidity + "%";
        }
        infoIndex++;

        for (var dayIndex = 0; dayIndex < forecastArticles.length; dayIndex++) { // UV Index elements

            UVIndex = forecast[dayIndex].uvi;

            (forecastArticles[dayIndex].children)[infoIndex].innerText = "UV Index: " + UVIndex;

            setUVcolor(UVIndex, (forecastArticles[dayIndex].children)[infoIndex]);
        }
    }
}

var formatDate = function(unixDate) { // convert unix date to MM/DD/YYYY
    var date = new Date(unixDate*1000);
    var month = date.getMonth() + 1;
   
    return month + "/" + date.getDate() + "/" + date.getFullYear();
}

var setUVcolor = function(UVindex, UVindexEl) { // sets css class baes on UV Index value

    if (0 <= UVindex && UVindex < 3) { // low - green

        UVindexEl.setAttribute("class", "uv-low");

    } 

    else if (3 <= UVindex && UVindex < 6) { // moderate - yellow

        UVindexEl.setAttribute("class", "uv-mod");

    } 

    else if (6 <= UVindex && UVindex < 8) { // high - orange

        UVindexEl.setAttribute("class", "uv-high");

    } 

    else if (8 <= UVindex && UVindex < 11) { // very high - red

        UVindexEl.setAttribute("class", "uv-vryHigh");

    } 

    else { // extreme - violet

        UVindexEl.setAttribute("class", "uv-extreme");

    } 
    

}

var buttonGenerator = function(inputText) { // adds a button to the page for searched city if it is not already added
    var citySelectorEl = document.querySelector(".city-selector");
    currentButtons = citySelectorEl.children;

    if (buttonsLoadedFromStorage === true) { // this check does not need to run if buttons are still loading from storage
        for (var i = 0; i < currentButtons.length; i++) { // if the button has already been created, do not create another
            if (inputText === currentButtons[i].innerText) {
                return;
            }
        }
    }

    var newButton = document.createElement("button"); // add button of searched city
    newButton.innerText = inputText;                  //
    citySelectorEl.appendChild(newButton);            //

    if (buttonsLoadedFromStorage === true) { 

        currentButtons = citySelectorEl.children; // update currentButtons array to prepare to save to localStorage

        for (var i = 0; i < currentButtons.length; i++) { // save currentButtons array to localStorage
            localStorage.setItem("number-of-buttons", currentButtons.length); // remeber how many buttons there are
            localStorage.setItem(i, currentButtons[i].innerText); // record buttons
        }
    }
}

var searchButtonHandler = function(event) {
    event.preventDefault();   
    inputText = event.target.parentElement.firstElementChild.value; // upon button click, record text in input field
    getLatLon(inputText);
    event.target.parentElement.firstElementChild.value = "";

}

var historyButtonHandler = function(event) {

    if (event.target.tagName === "DIV") { // kill function if user has missed the history buttons and just clicked the div
        return;
    }

    //saveCurrentCity(event.target.innerText); // set current-city in localStorage so getLatLon can pull it

    getLatLon(event.target.innerText);

}

loadButtons();

var searchButtonEl = document.querySelector(".search-button");
searchButtonEl.addEventListener("click", searchButtonHandler);

var citySelectorEL = document.querySelector(".city-selector");
citySelectorEL.addEventListener("click", historyButtonHandler);