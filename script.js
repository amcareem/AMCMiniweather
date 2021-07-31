$(document).ready(function getWeather() {
// Done by Ahamed Careem from Sri Lanka
// For the CS50 final project (Web)
// Software name is Mini Weather
    var lat;
    var lon;
    // Allow google to access the location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation services are not supported by your web browser.");
    }
  
    function success(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      var reversegeocodingapi = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+"%2C"+lon;
      $.getJSON(reversegeocodingapi, function(place) {
        for (var i=0; i<place.results[0].address_components.length; i++) {
          if (place.results[0].address_components[i].types[0]==="locality") {
            var city = place.results[0].address_components[i].long_name;
            $("#city").html(city.toUpperCase());
          }
          if (place.results[0].address_components[i].types[0]==="administrative_area_level_1") {
            var state = place.results[0].address_components[i].long_name;
            $("#state").html(state.toUpperCase());
          }
        }
      }); //end getJSON
      getWeatherData(lat, lon);
    } //end success
  
  
    function error() {
      alert("Geolocation requires a secure connection to work. Please add 'https://' to the beginning of this page's URL. (i.e. 'https://codepen.io/bethqiang/full/bZrZpa')");
    }
  
    function getWeatherData(latitude, longitude) {
      var weatherapiurl = "https://api.forecast.io/forecast/014dd470e25bffea4a246375af37ba17/"+latitude+","+longitude+"?callback=?"
      $.getJSON(weatherapiurl, function(weatherdata) {
        var tempf = Math.round(weatherdata.currently.temperature);
        $("#temp").html(tempf + "°");
        var tempc = Math.round(((weatherdata.currently.temperature)-32)/(9/5));
        var feelslikef = Math.round(weatherdata.currently.apparentTemperature);
        $("#feels-like").html("Feels Like: " + feelslikef + "°F");
        var feelslikec =  Math.round(((weatherdata.currently.apparentTemperature)-32)/(9/5));
        var summary = weatherdata.currently.summary;
        $("#weather-description").html(summary);
        //sky icons
        var icon = weatherdata.currently.icon;
        var skycons = new Skycons({"color": "AQUA"});
        skycons.set("weather-icon", icon);
        skycons.play();
  
  
        //weather forecast for three days
        var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday",
                  "Friday","Saturday"]; //find day of the week
        var dayArray = []; //store days of the week
        var iconArray = []; //store icon values
        var tempMaxArray = []; //store max temps
        var tempMinArray = []; //store min temps
        var precipArray = []; //store precipitation probability
        //to get all the information
        function weatherInfo() {
          var time = weatherdata.daily.data[i].time;
          var date = new Date(time*1000);
          day = weekday[date.getDay()];
          dayArray.push(day);
          var weatherIcon = weatherdata.daily.data[i].icon;
          iconArray.push(weatherIcon);
          var tempMax = weatherdata.daily.data[i].temperatureMax;
          tempMaxArray.push(tempMax);
          var tempMin = weatherdata.daily.data[i].temperatureMin;
          tempMinArray.push(tempMin);
          var precip = weatherdata.daily.data[i].precipProbability;
          precipArray.push(precip);
        };
        //if it's before 6am (but after midnight), run the function as if later that day = "tomorrow" (so if it's 4am on a Sunday, Sunday will still show up as the first day in the forecast)
        var now = new Date();
        var hour = now.getHours();
        if (hour < 6) {
          for (var i=0; i<3; i++) {
            weatherInfo();
          };
        } else {
          for (var i=1; i<4; i++) {
            weatherInfo();
          };
        };
  
        //put weekdays into html
        $("#day2").html(dayArray[0]);
        $("#day3").html(dayArray[1]);
        $("#day4").html(dayArray[2]);
        //put icons into html
        skycons.set("weather-icon-day2", iconArray[0]);
        skycons.set("weather-icon-day3", iconArray[1]);
        skycons.set("weather-icon-day4", iconArray[2]);
        //put highs and lows into html
        $("#day2-high-low").html(Math.round(tempMaxArray[0]) + "/" + Math.round(tempMinArray[0])+"°F");
        $("#day3-high-low").html(Math.round(tempMaxArray[1]) + "/" + Math.round(tempMinArray[1])+"°F");
        $("#day4-high-low").html(Math.round(tempMaxArray[2]) + "/" + Math.round(tempMinArray[2])+"°F");
        //put chance of precipitation into html
        $("#day2-precip").html((Math.round(precipArray[0]*10)/10)*100 + "%");
        $("#day3-precip").html((Math.round(precipArray[1]*10)/10)*100 + "%");
        $("#day4-precip").html((Math.round(precipArray[2]*10)/10)*100 + "%");
  
        //toggle between F and C for every temperature
        $("#cbutton").click(function(event) {
          $("#temp").html(tempc + "°");
          $("#feels-like").html("Feels Like: " + feelslikec + "°C");
          $("#day2-high-low").html(Math.round(((tempMaxArray[0])-32)*(5/9))+"/"+Math.round(((tempMinArray[0])-32)*(5/9))+"°C");
          $("#day3-high-low").html(Math.round(((tempMaxArray[1])-32)*(5/9))+"/"+Math.round(((tempMinArray[1])-32)*(5/9))+"°C");
          $("#day4-high-low").html(Math.round(((tempMaxArray[2])-32)*(5/9))+"/"+Math.round(((tempMinArray[2])-32)*(5/9))+"°C");
        });//end c click
        //f click
        $("#fbutton").click(function(event) {
          $("#temp").html(tempf + "°");
          $("#feels-like").html("Feels Like: " + feelslikef + "°F");
          $("#day2-high-low").html(Math.round(tempMaxArray[0])+"/"+Math.round(tempMinArray[0])+"°F");
          $("#day3-high-low").html(Math.round(tempMaxArray[1])+"/"+Math.round(tempMinArray[1])+"°F");
          $("#day4-high-low").html(Math.round(tempMaxArray[2])+"/"+Math.round(tempMinArray[2])+"°F");
        });//end if click
      }); //end getJSON
    }; //end getWeatherData
  });