
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

fetch('http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=a8fca69c0decd07fd47a9618050e95c3')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('API request was a success \n----------');
    console.log(data);
  });

