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
    // $("#cityInfoContainer").empty();
    $("#fiveDayForecast").empty();

    // There's either the next 6 days of content including today or starting from tomorrow
    // depending on how late in the day you call the API    
    let daysReturnedByAPI = [];
    if (moment().format("l") === dayList[0].dt_txt) {
        for (let i = 0; i < 6; i++) {
            daysReturnedByAPI.push(moment().add(i, "days").format("l"));
        }
    } else {
        for (let i = 1; i < 7; i++) {
            daysReturnedByAPI.push(moment().add(i, "days").format("l"));
        }
    }

    let dayNotRendered = false;
    // Display the information that's at 12:00pm each day
    
    for (let day = 0; day < daysReturnedByAPI.length; day++) {
        for (let index = 0; index < dayList.length; index++) {
            if (moment(dayList[index].dt_txt).format("l").includes(daysReturnedByAPI[day])) {
                renderForecastCard(cityName, dayList[index], index);
                break;
            }
        }
    }
}

// Contains all the data of a particular day at 12:00 pm
function renderForecastCard(cityName, dayObj, index) {    
    let date = dayObj.dt_txt;
    let temp = dayObj.main.temp;
    let humidity = dayObj.main.humidity;
    let windSpeed = dayObj.wind.speed;
    let weatherType = dayObj.weather[0].main.toLowerCase();


    // Add info to main card at the top if it's the first day (Note: UV was deprecated April 1st 2021)
    if (index === 0) {
        let cardBody = $("<div>").addClass("card-body");
        let cardTitle = $("<h5>").addClass("card-title").text(`${cityName} (${moment(date).format("l")})`);
        let cardTemp = $("<p>").addClass("card-text").text(`Temperature: ${Math.floor(temp)} ℉`);
        let cardHumidity = $("<p>").addClass("card-text").text(`Humidity: ${humidity}%`);
        let cardWindSpeed = $("<p>").addClass("card-text").text(`Wind speed: ${windSpeed} MPH`);
        let imgElem = $("<img>").attr("src", `assets/images/${weatherType}.webp`);

        cardBody.append(cardTitle);
        cardBody.append(imgElem);
        cardBody.append(cardTemp);
        cardBody.append(cardHumidity);
        cardBody.append(cardWindSpeed);

        $("#cityInfoContainer").empty();
        $("#cityInfoContainer").append(cardBody);
    } else {
            
        let dayTitle = $("<h5>").addClass("card-title").text(moment(date).format("l"));
        let tempText = $("<p>").addClass("card-text").text(`Temp: ${Math.floor(temp)} ℉`);
        let humidityText = $("<p>").addClass("card-text").text(`Humidity: ${humidity}%`);
        let imgElem = $("<img>").attr("src", `assets/images/${weatherType}.webp`);

        let newCardColumn = $("<div>").addClass("col");
        let newCardElem = $("<div>").addClass("card");
        let newCardBody = $("<div>").addClass("card-body bg-primary text-white");

        newCardBody.append(dayTitle);
        newCardBody.append(imgElem);
        newCardBody.append(tempText);
        newCardBody.append(humidityText);

        newCardElem.append(newCardBody);
        newCardColumn.append(newCardElem);

        $("#fiveDayForecast").append(newCardColumn);
    }
}