'use client'
import dynamic from "next/dynamic"
import { useState } from "react"
import "./page.css"
import ChartComponent from "./ChartComponent"
//import responseData1 from "./test2.json"
//import responseData2 from "./test1.json"
//import responseData1b from "./test3.json"
//import responseData3 from "./test4.json"
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
    const [year, setYear] = useState(2023)

    async function callApi(){
        if (mode === "record"){
            
            const params1 = {"elems":[{"interval":"dly","duration":1,"name":"maxt","smry":{"reduce":"max","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.sids[0],"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params1b = {"elems":[{"interval":"dly","duration":1,"name":"mint","smry":{"reduce":"min","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.sids[0],"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params2 = {"elems":[{"name":"maxt","interval":"dly","duration":"dly","normal":"91","prec":2},{"name":"mint","interval":"dly","duration":"dly","normal":"91","prec":2},{"name":"avgt","interval":"dly","duration":"dly","normal":"91","prec":2}],"sid":station.sids[0],"sDate":"2010-01-01","eDate":"2010-12-31"}            
      
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
            
           
            responseData1.smry[0].splice(59, 1)
            responseData1b.smry[0].splice(59, 1)
            
            const transformedData = responseData2.data.map((item, index) =>{
                return {
                    date: item[0],
                    max_temperature: parseFloat(item[1]),
                    min_temperature: parseFloat(item[2]), 
                    avg_temperature: parseFloat(item[3]),
                    record_high: parseFloat(responseData1.smry[0][index][0]),
                    record_high_year: responseData1.smry[0][index][1],
                    record_low: parseFloat(responseData1b.smry[0][index][0]),
                    record_low_year: responseData1b.smry[0][index][1]
                }
            })
            setData1(structuredClone(transformedData))
        }
        if (mode === "year"){
           
            const params1 = {"elems":[{"interval":"dly","duration":1,"name":"maxt","smry":{"reduce":"max","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.sids[0],"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params1b = {"elems":[{"interval":"dly","duration":1,"name":"mint","smry":{"reduce":"min","add":"date"},"groupby":["year","1-1","12-31"],"smry_only":1}],"sid":station.sids[0],"sDate":"por","eDate":"2024-12-31","meta":["name","state","valid_daterange","sids"]}
            const params2 = {"elems":[{"name":"maxt"},{"name":"mint"}],"sid":station.sids[0],"sDate":`${year}-01-01`,"eDate":`${year}-12-31`}
        
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
            const responseData3 = await response2.json()
            
           if (year % 4 != 0){
            responseData1.smry[0].splice(59, 1)
            responseData1b.smry[0].splice(59, 1)
           }
            const transformedData = responseData3.data.map((item, index) =>{
                return {
                    date: item[0],
                    max_temperature: parseFloat(item[1]),
                    min_temperature: parseFloat(item[2]), 
                    record_high: parseFloat(responseData1.smry[0][index][0]),
                    record_high_year: responseData1.smry[0][index][1],
                    record_low: parseFloat(responseData1b.smry[0][index][0]),
                    record_low_year: responseData1b.smry[0][index][1]
                }
            })
            setData2(structuredClone(transformedData))
        }
    }
    
    return(
    <div className="page">
        <h1 className="page-title">ACIS Grapher</h1>
        <div className="map-component">
            <MapComponent setClicked={setClickedCoords} clickedCoords={clickedCoords} setStation={setStation} setStationList={setStationList} stationList={stationList}/>
        </div>
        <div className="control-bar">
            <h2 className="selected">Selected station: {station.name}</h2>
            
            <div className="product-bar">
                <label htmlFor="mode-select">Select product:</label>
                <select name="mode" id="mode-select" onChange={(e) => setMode(e.target.value)}>  
                    <option value="record">Normals and Records</option>
                    <option value="year">Year Data</option>
                </select> 
                <button className="get-button" onClick={callApi}>Get Data</button>
                {   mode === "year" &&
                    <div>   
                        <label htmlFor="year-select">Year:</label>
                        <select name="year" id="year-select" onChange={(e) => setYear(e.target.value)}>  
                            {Array.from({length: 50}, (val, index) => 2024 - index).map(item => <option key={"year" + item} value={item}>{item}</option>)}
                        </select>
                    </div>
                } 
            </div>
        </div>
        <div className="chart-component">
            {(() => {
                switch(mode){
                    case 'record':
                        if (Object.keys(data1).length < 1){
                            return null
                        }
                        return (<ChartComponent data={data1} 
                        unit="°" 
                        variables={["max_temperature", "min_temperature", "avg_temperature", "record_high", "record_low"]}
                        labels={["Max Temperature", "Min Temperature", "Avg Temperature", "Record Highs", "Record Lows"]} />)
                    case 'year':
                        if (Object.keys(data2).length < 1){
                            return null
                        }
                        return (<ChartComponent data={data2} 
                        unit="°" 
                        variables={["max_temperature", "min_temperature", "record_high", "record_low"]}
                        labels={["Max Temperature", "Min Temperature", "Record Highs", "Record Lows"]} />)
                    default:
                        return null
                }
            })()}
        </div>
    </div>
    )
}