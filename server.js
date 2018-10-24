'use strict'


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

function handleError(err, res){
    console.log(`ERROR`, err);
    if(res){res.status(500).send(`sorry no peanuts`);}
}

app.get('/location', (request, response)=>{
    searchToLatLong(request.query.data)
    .then(locationData=> {
        response.send(locationData);
    })
    .catch(err => handleError(err,response));
})

function searchToLatLong(query){
    const URL = (`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`);
    console.log(query);
    return superagent.get(URL)
        .then(data =>{
            // console.log(data);
            if(!data.body.results.length){ throw `NO DATA`;}
            else{
                let location = new Location(data.body.results[0]);
                location.search_query = query; 
                // console.log(query);
                return location;
            }
    })
}

function Location(data){
    this.formatted_query = data.formatted_address;
    this.latitude = data.geometry.location.lat;
    this.longitude = data.geometry.location.lng;
}

app.get('/weather',getWeatherData);

function getWeatherData(request, response){
    const URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
    return superagent.get(URL)
        .then(results => {
            const weatherArray = [];
            results.body.daily.data.forEach((day)=>{
                weatherArray.push(new Weather(day));
            })
            response.send(weatherArray);
        })
}

function Weather(data){
    this.time = new Date(data.time*1000).toString().slice(0,15);
    this.forecast = data.summary;
    console.log(data.summary);
    console.log(data.time);

}



app.listen(PORT, ()=>{
    console.log(`app is running on ${PORT}`)
});
