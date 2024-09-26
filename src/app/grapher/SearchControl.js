'use client'
import { useRef } from "react"
import stations from "../_data/allstations.json"
export default function SearchControl(props){
    
    const station = useRef("NWCL1")
    //const [year, setYear] = useState(2023)
    //const [stationInput, setStationInput] = useState("")
    let year = useRef(2023)
    //let station = "NWCL1"
    async function recentHandler(){
        if (!stations.includes(station.current.trim())){
            console.log("Invalid Station")
            return
        }
        const res = await fetch("/api/" + station.current.trim())
        //const res = await fetch("http://localhost:5000/test")
        const resJson = await res.json()
        if ("error" in resJson) {
            props.setGraph1Desc("Invalid station and/or year.")
            return
        }
        props.setGraph1Desc(`Displaying recent 45 days for station ${station.current}`)
        props.setData(resJson)
    }

    async function historicHandler(){
        if (!stations.includes(station.current.trim())){
            console.log("Invalid Station")
            return
        }
        const res = await fetch(`/api/${station.current.trim()}/${year.current}`)
        const resJson = await res.json()
        if ("error" in resJson) {
            props.setGraph1Desc("Invalid station and/or year.")
            return
        }
     
        props.setGraph1Desc(`Displaying station ${station.current} for year ${year.current}`)
        props.setData(resJson)
    }

    function yearHandler(e){
        year.current = e.target.value
    }

    function stationHandler(e){
       // setStationInput(e.target.value)
        
        station.current = e.target.value
        console.log(station.current)
    }
    
    return(
        <div>
            <div id="searchbar" className="flex flex-row gap-8 justify-center items-center">
                <div id="station-part" className="">
                    <label htmlFor="stations-search" className="align-middle content-center">Enter Station:  </label>
                    <input list="list-stations" id="stations-search" className="border-2 border-black border-solid" autoComplete="on" onChange={stationHandler}/>
                        <datalist id="list-stations">
                            {stations.map((item, key) => 
                                <option key={key} value={item}></option>
                            )}
                        </datalist>
                </div>
                <button id="station-search-button-recent" className="bg-slate-200 rounded-md p-2" onClick={recentHandler}>Get Recent Data</button>
                <button id="station-search-button-historical" className="bg-slate-200 rounded-md p-2" onClick={historicHandler}>Get Historic Data</button>
                <div id="station-part" className="flex-row items-center gap-2">
                    <label htmlFor="year-select">Year:   </label>
                    <select name="year-select" year="year-select" className="align-middle h-8 rounded-md p-2" onChange={yearHandler}>
                        {(() => {
                            let arr = []
                            for(let i = 2023; i > 1980; i--){
                                arr.push(<option key={"year-" + i} value={i}>{i}</option>)
                            }
                            return arr
                        })()}
                    </select>
                </div>
            </div>
        </div>
    )
}