"use client"
import './page.css';
import ChartComponent from './ChartComponent.js'
import ControlBar from './ControlBar.js';
import CurrentBar from './CurrentBar.js'
import {useState} from 'react'
import dynamic from "next/dynamic"
const MapComponent = dynamic(() => import('./MapComponent.js'), {
    ssr: false,
  })

function parseHourly(origData){
  let data = []
    for (let i = 0; i < origData.hourly.time.length; i++){
        let tempObj = {}
        for (let key of Object.keys(origData.hourly)){
            tempObj[key] = origData.hourly[key][i] 
        }
        data.push(tempObj)
    }
  return data
}

export default function Page() {
  const [clickedCoords, setClickedCoords] = useState({lat: 30.000, lng: -90.000})
  const [weatherData, setWeatherData] = useState({})
  const [tempUnit, setTempUnit] = useState("f")
  
  let parsedHourly = []
  const currentWeather = {}
  if (Object.keys(weatherData).length !== 0){
    parsedHourly = parseHourly(weatherData)
    const currentTime = weatherData.current_weather.time.substring(0, 14) + "00"
    console.log(currentTime)
    const currentIndex = weatherData.hourly.time.indexOf(currentTime)
    currentWeather.temperature = weatherData.hourly.temperature_2m[currentIndex]
    currentWeather.dewpoint = weatherData.hourly.dewpoint_2m[currentIndex]
    currentWeather.apparent = weatherData.hourly.apparent_temperature[currentIndex]
    currentWeather.wetbulb = wetBulb(currentWeather.temperature, weatherData.hourly.relative_humidity_2m[currentIndex])
    let dayTemps = []
    let precip25 = null
    let precip75 = null
    for (let i = 0; i <= 23; i++){
      dayTemps.push(weatherData.hourly.temperature_2m[i])
    }
    currentWeather.highTemp = Math.max(...dayTemps)
    currentWeather.lowTemp = Math.min(...dayTemps)
    for (let index = 0; index < weatherData.hourly.precipitation_probability.length; index++){
      if (precip25 == null && weatherData.hourly.precipitation_probability[index] >= 25){
        const time = new Date(weatherData.hourly.time[index])
        const hour = time.getHours()
        precip25 = `${time.getMonth() + 1}/${time.getDate()} at ${hour < 12 ? (hour === 0 ? 12 : hour) + "AM" : (hour === 12 ? 12 : hour - 12) + "PM"}`
      }

      if (precip75 == null && weatherData.hourly.precipitation_probability[index] >= 75){
        const time = new Date(weatherData.hourly.time[index])
        const hour = time.getHours()
        precip75 = `${time.getMonth() + 1}/${time.getDate()} at ${hour < 12 ? (hour === 0 ? 12 : hour) + "AM" : (hour === 12 ? 12 : hour - 12) + "PM"}`
      }
      if (precip25 != null && precip75 != null){
        break
      }
    }
    if (precip25 == null){
      precip25 = "None in next 7 days"
    }
    if (precip75 == null){
      precip75 = "None in next 7 days"
    }
    currentWeather.nextPrecip25 = precip25
    currentWeather.nextPrecip75 = precip75
  }
  
  function wetBulb(temp, rh){
    const t = tempUnit === 'c' ? temp : (temp - 32) * (5/9)
    let calc = (t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659))) + (0.00391838 * Math.sqrt(rh * rh * rh) * Math.atan(0.23101 * rh)) - Math.atan(rh - 1.676331) + Math.atan(t + rh) - 4.686035;
    if (tempUnit === 'f'){
      calc = (calc * 9/5) + 32
    }
    return parseFloat(calc.toFixed(1))
  }
  
  return (
    <div className="App">
      <h1 className='page-title'>Weather Forecast</h1>
      <MapComponent setClicked={setClickedCoords} coords={clickedCoords}/>
      <ControlBar clickedCoords={clickedCoords} setWeatherData={setWeatherData} wetBulb={wetBulb} tempUnit={tempUnit} setTempUnit={setTempUnit}/>
      {Object.keys(weatherData).length !== 0 ? <CurrentBar current={currentWeather}/>: null}
      {Object.keys(weatherData).length !== 0 ? <ChartComponent data={parsedHourly} variables={["temperature_2m", "apparent_temperature", "dewpoint_2m", "wetbulb_temperature_2m"]} labels={["Temperature", "Dew Point", "Apparent Temperature, Wet Bulb Temperature"]} unit="°"/> : null}
      {Object.keys(weatherData).length !== 0 ? <ChartComponent data={parsedHourly} variables={["precipitation_probability", "cloudcover"]} labels={["Precipitation %", "Cloud Cover"]} unit="%"/> : null}
    </div>
  );
}


