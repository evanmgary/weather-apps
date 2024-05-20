import React from 'react'
import "./ControlBar.css"

function ControlBar(props){

    async function callApi(){
        let callStr = "https://api.open-meteo.com/v1/forecast?"
        callStr += `latitude=${props.clickedCoords.lat}&longitude=${props.clickedCoords.lng}`
        callStr += `&hourly=temperature_2m,dewpoint_2m,apparent_temperature,precipitation_probability,cloudcover,relative_humidity_2m`
        callStr += `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min`
        callStr += `&current_weather=true&temperature_unit=fahrenheit&timezone=auto`
        console.log("Calling api at " + callStr)
        const response = await fetch(callStr)
        const weatherData = await response.json()
        const wetBulbData = weatherData.hourly.temperature_2m.map((item, index) => props.wetBulb(item, weatherData.hourly.relative_humidity_2m[index]))
        weatherData.hourly.wetbulb_temperature_2m = wetBulbData       
        props.setWeatherData(weatherData)
    }

    return(
        <div className="controlBar">
            <h2 className="selected">Selected location: {Math.abs(props.clickedCoords.lat.toFixed(2))} {props.clickedCoords.lat > 0 ? "N" : "S"}, {Math.abs(props.clickedCoords.lng.toFixed(2))} {props.clickedCoords.lng > 0 ? "E" : "W"}</h2>
            <button className="selectButton" onClick={callApi}>Get Data</button>


        </div>
    )

}

export default ControlBar;