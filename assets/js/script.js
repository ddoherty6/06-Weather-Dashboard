var url = "http://openweathermap.org/img/w/10d.png";

//fetch(url).then(response, function())

var loadCurrentCity = function() {


}

var saveCurrentCity = function(inputText) {
    localStorage.setItem("current-city", inputText);
}

var getWeather = function() {
    console.log(localStorage.getItem("current-city"));
}

var buttonGenerator = function(inputText) {
    var citySelectorEl = document.querySelector(".city-selector");
    currentButtons = citySelectorEl.children;
    console.log(currentButtons);

    for (var i = 0; i < currentButtons.length; i++) { // if the button has already been created, do not create another
        if (inputText === currentButtons[i].innerText) {
            return;
        }
    }

    var newButton = document.createElement("button");
    newButton.innerText = inputText;
    citySelectorEl.appendChild(newButton);
}



var clickHandler = function(event) {
    event.preventDefault(); // can remove after persistence is established
    inputText = event.target.parentElement.firstElementChild.value; // upon button click, record text in input field

    saveCurrentCity(inputText);
    buttonGenerator(inputText);
    getWeather(inputText);
}



var searchButtonEl = document.querySelector(".search-button");
searchButtonEl.addEventListener("click", clickHandler);