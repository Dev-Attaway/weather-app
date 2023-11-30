
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

function init() {
  printCities();
}

function hide(elementId) {
  elementId.addClass('invisible');
}

function show(elementId) {
  elementId.removeClass('invisible');
}

function disableButton(buttonId) {

  // given a string that has the name of the id of the button which we want to disable when called
  let button = document.getElementById(buttonId);
  button.disabled = 'disabled';
}

function newSearch() {

  // appends a new element to target to display to the user that a new search is init
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

      //If quickTimer is less than or equal to 0 then hide the element 
      clearInterval(timer);
      resetPage();

    }
    // set in Nanoseconds
  }, 100);
  timerCtr = 20;
}

function resetPage() {
  // location == current page == index.html
  location.reload();
}

function saveToStorage() {

  // loads the current cities saved in local storage
  let cityList = fromStorage();

  // $('#city') has the name of the city to be saved
  let cityName = city.val();

  // create a newCity object which has one attribute: the name of the saved city
  let newCity = {
    city_name: cityName
  };

  // overwrites the "cold start" case where nothing has been saved to local yet
  if (cityList[0] === null) {
    cityList[0] = newCity;
  }
  else {
    cityList.push(newCity);
  }
  //We want to update local storage with the new object added
  saveCityToStorage(cityList);
}

function fromStorage() {
  let cityName = localStorage.getItem('cityList');

  //If somebtnNumber was successfully loaded in the description then 
  // JSON.parse(description) transforms the strings loaded from
  //  local storage into objects
  if (cityName) {
    cityName = JSON.parse(cityName);
  }

  // returns an empty array if description = falsey
  // meaning that there was nothing in local storage to load 
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

      //If quickTimer is less than or equal to 0 then hide the element 
      clearInterval(timer);
      resetPage();
    }
    // set in Nanoseconds
  }, 100);
  // Resets timer back to 10 for the next time an invalid zip code is entered
  timerCtr = 20;
}

function notRealCity() {

  $('#target').append('<div class="card">' +
    '<div class="card-body">' +
    '<h3 class="mb-3">Not a Real City... </h3>' +
    '</div>' +
    '</div>');
  timer = setInterval(function () {
    timerCtr--;
    //  Show element indicating that user's Zip Code is invalid  
    if (timerCtr <= 0) {

      //If quickTimer is less than or equal to 0 then hide the element 
      clearInterval(timer);
      $('#target').empty();
    }
    // set in Nanoseconds
  }, 60);
  // Resets timer back to 10 for the next time an invalid zip code is entered
  timerCtr = 20;
}

function printCities() {
  let cityList = fromStorage();

  //If nothing is local then don't append anything  
  if (cityList[0] != null) {

    // otherwise print all saved cities from local
    for (let i = 0; i < cityList.length; i++) {
      //These button ids will be used to determine code operation see: line 214
      svCityList.append('<li id="nav-delete-btn" class="list-group-item">' + cityList[i].city_name + '</li>' +
        '<div id="div-delete-btn" class = "d-flex">' +
        '<button type="button" id="deleteBtn' + i + '" class="mb-4 mt-2 btn btn-danger">Delete</button>' +
        '<button type="button" id="loadBtn' + i + '" class="ml-auto mb-4 mt-2 btn btn-success">Load this </button>' +
        '</div>'
      );
    }

    //This will test any button pressed, probably not the best method 
    let navBtnControl = $('button')

    // when any button is pressed
    navBtnControl.on("click", function () {

      //The code grabs the ID of the button pressed
      //We can now find the individual buttons within the nav
      let buttonId = $(this).attr('id')

      // we need to discover whether the button pressed is a delete btn or a load btn 
      let searchTerm = 'n'
      let found = buttonId.slice(0, buttonId.indexOf(searchTerm) + 1);
      let number = buttonId.slice(buttonId.indexOf(searchTerm) + 1, buttonId.length);
      let loadedCity = navList.children('li');

      // if the button pressed is a deleteBtn then determine what city is being deleted by exploring the li
      // using the id="deleteBtn' + i +... i = number, we can now determine the city-based 
      // off of the button pressed
      if (found == "deleteBtn") {
        deleteFromStorage(loadedCity[number].innerHTML);
        loadedCity[number].innerHTML = "This city has been deleted...";
        let disableLoadThis = $(this).next().attr('id');
        disableButton(disableLoadThis);
      }
      //If the button pressed is a loadBtn then determine what city is being deleted by exploring the li
      // using the id="loadBtn' + i +... i = number, we can now determine the city-based 
      // off of the button pressed
      if (found == "loadBtn") {
        let cityName = loadedCity[number].innerHTML

        // .empty() removes not only child (and other descendant)
        //  elements, but also any text within the set of matched elements.
        // https://api.jquery.com/empty/ for more
        $('.current-day').empty();
        $('.5-day').empty();
        $('#5day-target').empty();
        disableButton("svCityBtn");

        // pass the city called the API call, this will load data
        apiCall(cityName);
      }
      // else
      // do nothing 
    });
  }

  function deleteFromStorage(city) {
    let cityList = fromStorage();

    for (let i = 0; i < cityList.length; i++) {
      if (cityList[i].city_name == city) {
        // remove the object at the current iteration of i, the loop as found the city to remove
        cityList.splice(i, 1)

        // remove everything from the local storage
        localStorage.clear();

        // Upload the new array of objects without the city that was removed
        saveCityToStorage(cityList);
      }
    }
  }
}

function apiCall(cityName) {

  //If cityName is truthy then do the work 
  if (cityName) {

    // force the name into our city through concatting the string\
    const cityNameCall = 'http://api.openweathermap.org/geo/1.0/direct?q=' +
      cityName + ',US&appid=' + key;

    fetch(cityNameCall)
      .then(function (cityNameresponse) {
        return cityNameresponse.json();
      })
      .then(function (cityNameData) {
        // in the case the city doesn't exist then the call returns an empty array whose length is 0
        if (cityNameData.length == 0) {
          notRealCity()
        }
        else {


          console.log('API request was a success \n----------');
          console.log(cityNameData);

          // grabbing the lat and long 
          let temp1 = cityNameData[0].lat;
          let temp2 = cityNameData[0].lon;

          //converting lat and long into strings
          temp1 = temp1.toString();
          temp2 = temp2.toString();

          //officially declaring var lat and long, these strings have the last two digits removed  
          let lat = temp1.slice(0, temp1.length - 2);
          let long = temp2.slice(0, temp2.length - 2);

          //We have the geolocation of the city now we need to make a current weather call and a 5 day forecast call

          // Now that we have the lat and long we can use string concat to insert those values and make an API call 
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
                  //The article  provides instructions on how this operation is taking place
                  $('.current-day').append('<div id="icon" class="p-2"><img id="wicon" src="" alt="Weather icon"></div>');

                  let icon = currentWeatherData.weather[0].icon;
                  let iconurl = "http://openweathermap.org/img/w/" + icon + ".png";

                  $('#wicon').attr('src', iconurl);
                  $('.weather-icon').append(icon);
                  $('.5-day').append('<h3> 5-Day Forecast <h3>');

                  // now that we have all the data loaded from the APIs called, we can continue with 
                  // updating the page's 5-day forecast
                  //stupid code but we don't need anything more complex 
                  for (let i = 0; i < weatherCall5DayData.list.length; i = i + 8) {

                    //While the loop is iterating, the code will store data
                    let temperature5Day = weatherCall5DayData.list[i].main.temp;
                    let humidity5Day = weatherCall5DayData.list[i].main.humidity;
                    let wind5Day = weatherCall5DayData.list[i].wind.speed;
                    let futureDay = weatherCall5DayData.list[i].dt_txt;
                    let icon5day = weatherCall5DayData.list[i].weather[0].icon;

                    //Removing the time stamp from the data grabbed
                    futureDay = futureDay.slice(0, futureDay.length - 9);

                    // in index.html the div whose id= 5day-target will have new elements with data
                    // grabbed from API calls, these elements will be visible to the user and represent
                    // weather data for the 5-day forecast
                    $('#5day-target').append('<div class="card">' +
                      '<div id="icon" class="p-2"><img id="wicon' + i + '" src="" alt="Weather icon"></div>' +
                      '<div class="card-body">' +
                      '<h5 class="card-title p-2">' + futureDay + '</h5>' + '<div class="wind p-2">Wind: ' + wind5Day + ' MPH</div>' +
                      '<div class="temp p-2">Temperature: ' + temperature5Day + ' °F</div>' +
                      '<div class="hum p-2">Humidity: ' + humidity5Day + ' %</div>' +
                      '</div>');

                    // https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
                    // the article  provides instructions on how this operation is taking place
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
        }
      });
  }
  else
    notRealCity();
}

// when the document is ready, run init and wait for button clicks
$(function () {

  init();

  saveBtn.on('click', function () {
    let cityName = city.val();
    apiCall(cityName);
  });

  resetBtn.on('click', newSearch)

  svCityBtn.on('click', function () {
    saveToStorage();
    citySaved();
  });

});
