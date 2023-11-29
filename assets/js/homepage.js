// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

// this is a bogus Zipcode at the moment 

let city = $('#city');
let saveBtn = $('#svBtn');
let resetBtn = $('#newSearch');
let svCityBtn = $('#svCityBtn');
let svCityList = $('#city-list');
let navList = $('#city-list');

let today = dayjs();
const key = 'fb1f3dcb852ef70f92f8472645b9bbfd';
let timer;
let timerCtr = 20;


// A simple function which validates the Zip Code has a correct length of 5
function init() {
  printCities();
}

saveBtn.on('click', function () {
  let cityName = city.val();
  apiCall(cityName);
});

resetBtn.on('click', newSearch)

svCityBtn.on('click', function () {
  saveToStorage();
  citySaved();
});


function hide(elementId) {
  elementId.addClass('invisible');
}

function show(elementId) {
  elementId.removeClass('invisible');
}

function disableButton(buttonId) {
  let button = document.getElementById(buttonId);
  button.disabled = 'disabled';
}

function newSearch() {

  $('#target').append('<div class="card">' +
    '<div class="card-body">' +
    '<h3 class="mb-3">Beginning a new search</h3>' +
    '</div>' +
    '</div>');

  timer = setInterval(function () {
    timerCtr--;

    //  Show element indicating that user's Zip Code is invalid  
    hide($('#saveThisCity'));
    if (timerCtr <= 0) {

      //  if quickTimer is less than or equal to 0 then hide the element 
      clearInterval(timer);
      resetPage();

    }
    // set in Nanoseconds
  }, 100);
  // Resets timer back to 10 for the next time an invlaid zip code is entered
  timerCtr = 20;
}

function resetPage() {
  location.reload();
}

function saveToStorage() {
  let cityList = fromStorage();
  let cityName = city.val();

  let newCity = {
    city_name: cityName
  };

  if (cityList[0] === null) {
    cityList[0] = newCity;
  }

  else {
    cityList.push(newCity);
  }
  saveCityToStorage(cityList);
}

function fromStorage() {
  let cityName = localStorage.getItem('cityList');

  // if somebtnNumber was succefully loaded in description then 
  // JSON.parse(discription) transfroms the strings loaded from
  //  local storage into objects
  if (cityName) {
    cityName = JSON.parse(cityName);
  }

  // returns an empty array if description = falsey
  // meaning that there was nobtnNumber in local storage to load 
  else {
    cityName = [null];
  }

  return cityName;
}

function saveCityToStorage(city) {
  localStorage.setItem('cityList', JSON.stringify(city));
}

function citySaved() {

  $('#target').append('<div class="card">' +
    '<div class="card-body">' +
    '<h3 class="mb-3">Save succesful, beginning a new search</h3>' +
    '</div>' +
    '</div>');

  timer = setInterval(function () {
    timerCtr--;
    //  Show element indicating that user's Zip Code is invalid  
    hide($('#saveThisCity'));
    if (timerCtr <= 0) {

      //  if quickTimer is less than or equal to 0 then hide the element 
      clearInterval(timer);
      resetPage();
    }
    // set in Nanoseconds
  }, 100);
  // Resets timer back to 10 for the next time an invlaid zip code is entered
  timerCtr = 20;
}

function printCities() {
  let cityList = fromStorage();

  if (cityList[0] != null) {
    for (let i = 0; i < cityList.length; i++) {
      svCityList.append('<li id="nav-delete-btn" class="list-group-item">' + cityList[i].city_name + '</li>' +
        '<div id="div-delete-btn" class = "d-flex">' +
        '<button type="button" id="deleteBtn' + i + '" class="mb-4 mt-2 btn btn-danger">Delete</button>' +
        '<button type="button" id="loadBtn' + i + '" class="ml-auto mb-4 mt-2 btn btn-success">Load this </button>' +
        '</div>'
      );
    }


    let navBtnControl = $('button')

    navBtnControl.on("click", function () {

      // we can now find the individual buttons within the nav
      let buttonId = $(this).attr('id')

      // we need to discover whether the button pressed is a delete btn or a load btn 
      let searchTerm = 'n'
      let found = buttonId.slice(0, buttonId.indexOf(searchTerm) + 1);
      let number = buttonId.slice(buttonId.indexOf(searchTerm) + 1, buttonId.length);
      let loadedCity = navList.children('li');

      if (found == "deleteBtn") {
        deleteFromStorage(loadedCity[number].innerHTML);
        loadedCity[number].innerHTML = "This city has been deleted...";
        let disableLoadThis = $(this).next().attr('id');
        disableButton(disableLoadThis);
        console.log(disableLoadThis);
      }

      if (found == "loadBtn") {
        console.log("thing")
        let cityName = loadedCity[number].innerHTML
        $('.current-day').empty();
        $('.5-day').empty();
        $('#5day-target').empty();
        apiCall(cityName);
      }
    });

  }


  function deleteFromStorage(city) {
    let cityList = fromStorage();

    for (let i = 0; i < cityList.length; i++) {
      if (cityList[i].city_name == city) {
        // remove the object at the current iteration of i, the loop as found the city to remove
        cityList.splice(i, 1)

        // remove everthing from the local storage
        localStorage.clear();

        // Upload the new array of bojects without the city that was removed
        saveCityToStorage(cityList);
      }
    }
  }
}

function apiCall(cityName) {

  // if cityName is truthy then do work 
  if (cityName) {

    // force the name into our city through concatting the string\
    const cityNameCall = 'http://api.openweathermap.org/geo/1.0/direct?q=' +
      cityName + ',US&appid=' + key;

    fetch(cityNameCall)
      .then(function (cityNameresponse) {
        return cityNameresponse.json();
      })
      .then(function (cityNameData) {
        console.log('API request was a success \n----------');
        console.log(cityNameData);

        // grabbing the lat and long 
        let temp1 = cityNameData[0].lat;
        let temp2 = cityNameData[0].lon;

        // coverting lat and long into strings
        temp1 = temp1.toString();
        temp2 = temp2.toString();

        // offically declaring var lat and long, these strings have the last two digits removed  
        let lat = temp1.slice(0, temp1.length - 2);
        let long = temp2.slice(0, temp2.length - 2);

        // we have the geolocation of the city now we need make a current weather call and a 5 dat forcast call

        // NOw that we have the lat and long we can use string concat to insert those values and make an API call 
        const weatherCall5Day = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=' + key
          + '&cnt=40&units=imperial';

        fetch(weatherCall5Day)
          .then(function (weatherCall5DayResponse) {
            return weatherCall5DayResponse.json();
          })

          .then(function (weatherCall5DayData) {
            console.log('API request was a success \n----------');
            console.log(weatherCall5DayData);

            const currentWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid='
              + key + '&units=imperial';

            fetch(currentWeather)
              .then(function (currentWeatherResponse) {
                return currentWeatherResponse.json();
              })

              .then(function (currentWeatherData) {
                console.log('API request was a success \n----------');
                console.log(currentWeatherData);

                // https://openweathermap.org/forecast5#data for how to nav the fields

                $('.current-day').append('<div class="name p-2 font-weight-bold">' + cityNameData[0].name + '  '
                  + '[' + today.format('MMM D, YYYY') + ']' + ' </div>');

                let temperature = currentWeatherData.main.temp
                $('.current-day').append('<div class="temp p-2">Temperature: ' + temperature + ' °F</div>');

                let wind = currentWeatherData.wind.speed
                $('.current-day').append('<div class="wind p-2">Wind: ' + wind + ' MPH</div>');

                let humidity = currentWeatherData.main.humidity
                $('.current-day').append('<div class="hum p-2">Humidity: ' + humidity + ' %</div>');

                // https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
                // the article approve provides instruction on how this operation is taking place
                $('.current-day').append('<div id="icon" class="p-2"><img id="wicon" src="" alt="Weather icon"></div>');

                // let icon = weatherCall5DayData.list[0].weather[0].icon;
                let icon = currentWeatherData.weather[0].icon;

                let iconurl = "http://openweathermap.org/img/w/" + icon + ".png";

                $('#wicon').attr('src', iconurl);

                $('.weather-icon').append(icon);

                $('.5-day').append('<h3> 5-Day Forecast <h3>');

                // now that we have all the data loaded from the APIs called, we can continue with 
                // updating the page's 5-day forcast
                // really supid code but we really don't need anything more complex 
                for (let i = 0; i < weatherCall5DayData.list.length; i = i + 8) {

                  let temperature5Day = weatherCall5DayData.list[i].main.temp;
                  let humidity5Day = weatherCall5DayData.list[i].main.humidity;
                  let wind5Day = weatherCall5DayData.list[i].wind.speed;
                  let futureDay = weatherCall5DayData.list[i].dt_txt;
                  let icon5day = weatherCall5DayData.list[i].weather[0].icon;

                  futureDay = futureDay.slice(0, futureDay.length - 9);

                  $('#5day-target').append('<div class="card">' +
                    '<div id="icon" class="p-2"><img id="wicon' + i + '" src="" alt="Weather icon"></div>' +
                    '<div class="card-body">' +
                    '<h5 class="card-title p-2">' + futureDay + '</h5>' + '<div class="wind p-2">Wind: ' + wind5Day + ' MPH</div>' +
                    '<div class="temp p-2">Temperature: ' + temperature5Day + ' °F</div>' +
                    '<div class="hum p-2">Humidity: ' + humidity5Day + ' %</div>' +
                    '</div>');

                  let iconUrl5day = "http://openweathermap.org/img/w/" + icon5day + ".png";
                  $('#wicon' + i).attr('src', iconUrl5day);
                  $('.weather-icon').append(icon5day);
                }
                show($('#target-1'));
                show($('#target-2'));
                show($('#target-3'));
                show($('#saveThisCity'));
                disableButton('svBtn');
              });
          });
      });
  }
  else
    window.alert("Thats not a real city")
}

init();
