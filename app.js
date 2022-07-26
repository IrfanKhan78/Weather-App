// jshint esverion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){

  const query = req.body.cityName;
  const apiKey = "1c17dbcda9f823dd1a5965c5ed2650ae";
  const unit = "metric";
  const date = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timezone: "EST"});

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response){

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp.toFixed(1);
      const weatherDescription = weatherData.weather[0].description;
      const realFeeling = weatherData.main.feels_like;
      const windSpeed = weatherData.wind.speed;

      const windSpeedKmHr = (windSpeed * 3.6).toFixed(2);

      const humidity = weatherData.main.humidity;
      const iconID = weatherData.weather[0].icon;
      const icon = "http://openweathermap.org/img/wn/" + iconID + "@2x.png";

      res.render("data", {
        city: query,
        time: date,
        temperature: temp,
        description: weatherDescription,
        feels_like: realFeeling,
        wind: windSpeedKmHr,
        humidity: humidity,
        iconImage: icon
      })

    })
  })
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
