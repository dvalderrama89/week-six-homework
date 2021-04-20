$(function() {
    $("#searchButton").click(function() {
        let searchText = $("#searchInput").val();
        appendToSearchHistory(searchText);
        getWeatherData(searchText);
    })
})

function appendToSearchHistory(term) {
    // Creates the list item to add to the ul
    let historyElem = $("<li>");
    historyElem.addClass("list-group-item");
    historyElem.text(term)
    $("#searchHistory").prepend(historyElem);
}

function getWeatherData(term) {
    let key1 = "facb73ff9b05fe";
    let key2 = "5bd7b6e20c2d168cb7";
    let a = "app";
    let i = "id";
    let d = `${a}${i}=${key1}${key2}`;
    let apiURL = `http://api.openweathermap.org/data/2.5/forecast?q=${term}&${d}&units=imperial`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => renderForecast(data));
}

function renderForecast(data) {
    let cityName = data.city.name;
    let dayList = data.list;

    // Clear out any old elements on a new search
    $("#cityInfoContainer").empty();
    $("#fiveDayForecast").empty();

    // Display the information that's at 12:00pm each day
    for (let index = 0; index < dayList.length; index++) {
        if (dayList[index].dt_txt.includes("12:00:00")) {
            renderForecastCard(cityName, dayList[index]);
        }
    }
}

// Contains all the data of a particular day at 12:00 pm
function renderForecastCard(cityName, dayObj) {    
    let date = dayObj.dt_txt;
    let temp = dayObj.main.temp;
    let humidity = dayObj.main.humidity;
    let windSpeed = dayObj.wind.speed;

    let dayTitle = moment(date).format("l");
    let tempText = $("<p>").addClass("card-text").text(`Temp: ${temp} ℉`);
    let humidityText = $("<p>").addClass("card-text").text(`Humidity: ${humidity}%`);

    let newCardColumn = $("<div>").addClass("col");
    let newCardElem = $("<div>").addClass("card");
    let newCardBody = $("<div>").addClass("card-body");

    newCardBody.append(dayTitle);
    newCardBody.append(tempText);
    newCardBody.append(humidityText);

    newCardElem.append(newCardBody);
    newCardColumn.append(newCardElem);

    $("#fiveDayForecast").append(newCardColumn);

    // Add info to main card (Note: UV was deprecated April 1st 2021)
    if (dayTitle === moment().format("l")) {
        let cardBody = $("<div>").addClass("card-body");
        let cardTitle = $("<h5>").addClass("card-title").text(`${cityName} (${moment(date).format("l")})`);
        let cardTemp = $("<p>").addClass("card-text").text(`Temperature: ${temp} ℉`);
        let cardHumidity = $("<p>").addClass("card-text").text(`Humidity: ${humidity}%`)
        let cardWindSpeed = $("<p>").addClass("card-text").text(`Wind speed: ${windSpeed} MPH`);

        cardBody.append(cardTitle);
        cardBody.append(cardTemp);
        cardBody.append(cardHumidity);
        cardBody.append(cardWindSpeed);
        $("#cityInfoContainer").append(cardBody);
    }
}