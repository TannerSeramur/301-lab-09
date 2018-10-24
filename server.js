'use strict'


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

app.get('/location', (request, response)=>{
    const locationData = searchToLatLong(request.query.data);
    response.send(locationData); 
})

function searchToLatLong(query){
    // const URL =
    const geoData = require('./data/geo.json');
    const location = new Location(geoData.results[0]);
    location.search_query = query;
    return location;
}

function Location(data){
    this.formatted_query = data.formatted_address;
    this.latitude = data.geometry.location.lat;
    this.longitude = data.geometry.location.lng;
}

app.get('/weather', (request, response) => {
    const weatherData = getWeatherData(request.query.data);
    response.send(weatherData);
})

function getWeatherData(query){
    const darksky = require('./data/darksky.json');
    const weatherArray = [];
    const weather = darksky.daily.data.forEach((item)=>{
        weatherArray.push(new Weather(item));
    })
    return weatherArray; 
}

function Weather(data){
    this.time = new Date(data.time*1000).toString().slice(0,15);
    this.forecast = data.summary;
    console.log(data.summary);

}



app.listen(PORT, ()=>{
    console.log(`app is running on ${PORT}`)
});
