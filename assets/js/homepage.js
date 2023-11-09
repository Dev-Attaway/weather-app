
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}


let api_url = 'http://api.openweathermap.org/geo/1.0/direct?q=places&limit=5&appid=a8fca69c0decd07fd47a9618050e95c3';


fetch(api_url)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('API request was a success \n----------');
    console.log(data);
  });

let city = $('#city');
let saveBtn = $('#svBtn');







saveBtn.on('click', function () {
  cityName = city.val();

  // if cityName is truthy then do work 
  if (cityName) {

    // force the name into our city through concatting the string
    api_url = 'http://api.openweathermap.org/geo/1.0/direct?q=' +
      cityName + ',US&limit=5&appid=a8fca69c0decd07fd47a9618050e95c3';

    fetch(api_url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('API request was a success \n----------');
        console.log(data);
      });
  }
});