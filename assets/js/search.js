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
    let city = data.city;
    let dayList = data.list;

    // Display the information that's at 12:00pm each day
    for (let index = 0; index < dayList.length; index++) {
        if (dayList[index].dt_txt.includes("12:00:00")) {
            renderForecastCard(dayList[index]);
        }
    }
}

// Contains all the data of a particular day at 12:00 pm
function renderForecastCard(dayObj) {
    let date = dayObj.dt_txt; // TODO: format this with moment
    let temp = dayObj.main.temp;
    let humidity = dayObj.main.humidity;
    console.log(date);
    console.log(temp);
    console.log(humidity);
    console.log("-----");
}