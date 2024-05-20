'use client'
import dynamic from "next/dynamic"
import { useState } from "react"
import "./page.css"
import ChartComponent from "./ChartComponent"
const MapComponent = dynamic(() => import('./MapComponent.js'), {
    ssr: false,
  })

export default function Page(){
    const [clickedCoords, setClickedCoords] = useState({lat: 30.0, lng: -90.0})
    const [stationList, setStationList] = useState([])
    const [station, setStation] = useState({})
    const [mode, setMode] = useState("record")
    //data1/2/3 vary depending on the type of chart wanted by the user
    const [data1, setData1] = useState({})
    const [data2, setData2] = useState({})
    const [data3, setData3] = useState({})
    const [year, setYear] = useState(2024)

    async function callApi(mode){
        if (mode === "record"){
            const params1 = {"elems":[{"interval":"dly","duration":1,"name":"maxt","smry":{"reduce":"max","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.name.replace(" ", "+"),"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params1b = {"elems":[{"interval":"dly","duration":1,"name":"mint","smry":{"reduce":"min","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.name.replace(" ", "+"),"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params2 = {"elems":[{"name":"maxt","interval":"dly","duration":"dly","normal":"91","prec":2},{"name":"mint","interval":"dly","duration":"dly","normal":"91","prec":2},{"name":"avgt","interval":"dly","duration":"dly","normal":"91","prec":2}],"sid":station.name.replace(" ", "+"),"sDate":"2010-01-01","eDate":"2010-12-31"}
            
            //call api
            const response1 = await fetch('https://data.rcc-acis.org/StnData',
                {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(params1)}
            )
            const response1b = await fetch('https://data.rcc-acis.org/StnData',
                {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(params1b)}
            )
            const response2 = await fetch('https://data.rcc-acis.org/StnData',
                {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(params2)}
            )
            
            const responseData1 = await response1.json()
            const responseData1b = await response1b.json()
            const responseData2 = await response2.json()
            const transformedData = responseData2.data.map((item, index) =>{
                return {
                    date: item[0],
                    max_temperature: item[1],
                    min_temperature: item[2], 
                    avg_temperature: item[3],
                    record_high: responseData1.smry[0][index][0],
                    record_high_year: responseData1.smry[0][index][1],
                    record_low: responseData1b.smry[0][index][0],
                    record_low_year: responseData1b.smry[0][index][1]
                }
            })
            setData1(transformedData)
        }
        if (mode === "year"){
            const params1 = {"elems":[{"interval":"dly","duration":1,"name":"maxt","smry":{"reduce":"max","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.name.replace(" ", "+"),"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params1b = {"elems":[{"interval":"dly","duration":1,"name":"mint","smry":{"reduce":"min","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.name.replace(" ", "+"),"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params2 = {"elems":[{"name":"maxt"},{"name":"mint"}],"sid":"24131+1","sDate":`${year}-01-01`,"eDate":`${year}-12-31`}
        
            const response1 = await fetch('https://data.rcc-acis.org/StnData',
                {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(params1)}
            )
            const response1b = await fetch('https://data.rcc-acis.org/StnData',
                {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(params1b)}
            )
            const response2 = await fetch('https://data.rcc-acis.org/StnData',
                {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(params2)}
            )
            const responseData1 = await response1.json()
            const responseData1b = await response1b.json()
            const responseData2 = await response2.json()
            const transformedData = responseData2.data.map((item, index) =>{
                return {
                    date: item[0],
                    max_temperature: item[1],
                    min_temperature: item[2], 
                    record_high: responseData1.smry[0][index][0],
                    record_high_year: responseData1.smry[0][index][1],
                    record_low: responseData1b.smry[0][index][0],
                    record_low_year: responseData1b.smry[0][index][1]
                }
            })
            setData2(transformedData)
        }
        
        
        
    }
    
    return(
    <div className="page">
        <div className="map-component">
            <MapComponent setClicked={setClickedCoords} clickedCoords={clickedCoords} setStation={setStation} setStationList={setStationList} stationList={stationList}/>
        </div>
        <div className="controlBar">
            <h2 className="selected">Selected station: {station.name}</h2>
            <button className="selectButton" onClick={callApi}>Get Data</button>
            <label for="mode-select">Select product:</label>
            <select name="mode" id="mode-select" onChange={(e) => setMode(e.target.mode)}>  
                <option value="record">Normals and Records</option>
                <option value="year">Year Data</option>
            </select> 
            {   mode === "year" &&
                <div>   
                    <label for="year-select">Year:</label>
                    <select name="year" id="year-select" onChange={(e) => setYear(e.target.value)}>  
                        {Array.from({length: 50}, (val, index) => 2024 - index).map(item => <option key={"year" + item} value={item}>{item}</option>)}
                    </select>
                </div>
            } 
        </div>
        <div className="chart-component">
            {() => {
                switch(mode){
                    case 'record':
                        if (Object.keys(data1).length < 1){
                            return null
                        }
                        return <ChartComponent data={data1} 
                        unit="°" 
                        variables={["max_temperature", "min_temperature", "avg_temperature", "record_high", "record_low"]}
                        labels={["Max Temperature", "Min Temperature", "Avg Temperature", "Record Highs", "Record Lows"]}/>
                    case 'year':
                        if (Object.keys(data2).length < 1){
                            return null
                        }
                        return <ChartComponent data={data2} 
                        unit="°" 
                        variables={["max_temperature", "min_temperature", "record_high", "record_low"]}
                        labels={["Max Temperature", "Min Temperature", "Record Highs", "Record Lows"]}/>
                    default:
                        return null
                }
            }}
        </div>
    </div>
    )
}