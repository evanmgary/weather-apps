import React, { useState, useRef } from "react";
import L from 'leaflet'
import "leaflet/dist/leaflet.css" 
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet"
import "./MapComponent.css"
import { isMobile } from "react-device-detect";

function MapComponent(props){
    const mapRef = useRef()
    const center = {lat: 30.05, lng: -90.00}
    const [locSearch, setLocSearch] = useState("")
    const [locData, setLocData] = useState([])
    const rect = useRef(null)
    const markerGroupRef = useRef(L.layerGroup([]))
    const [locVisible, setLocVisible] = useState(false)
    const boxSize = 0.2

    async function searchHandler(){
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locSearch}&count=10&language=en&format=json`)
        const data = await res.json()
        setLocData(data["results"] ? data["results"] : [])
        setLocVisible(true)
    }

    function clickLocation(lat, lng){
        const map = mapRef.current
        props.setClicked({lat: lat, lng: lng})
        const latlng = new L.LatLng(lat, lng)
        const bounds = [[latlng.lat - boxSize, latlng.lng - boxSize], [latlng.lat + boxSize, latlng.lng + boxSize]]
        map.flyTo(latlng, 10)
        if (rect.current){
            map.removeLayer(rect.current)
        }
        const newRect = new L.rectangle(bounds, {color: "#ff4949", weight: 1})
        //setMarker(newMarker)    
        rect.current = newRect
        if (rect.current){
            map.addLayer(rect.current)
        }
        setLocVisible(false)
    }

    const ClickHandler = ({onClick}) => {
        const map = useMapEvents({
            click: (e) => {
                clickLocation(e.latlng.wrap().lat, e.latlng.wrap().lng)
            }
        })
    }

    function enterHandler(e){
        if (e.key == "Enter"){
            searchHandler()
        }
    }

    function clickStation(station){
        console.log("Clicked station " + station.name)
        props.setStation(station)
    }

    function locateUser(){
        const map = mapRef.current
        map.locate({setView: true})
            .on('locationfound', (e) => {
                clickLocation(e.latlng.lat, e.latlng.lng)
            })
            .on('locationerror', (e) => {
                console.log("Cannot locate user. Permission may have been denied.")
            })

    }

    async function fetchStationsAndDisplay(){
        const lat = props.clickedCoords.lat
        const lng = props.clickedCoords.lng
        props.setClicked({lat: lat, lng: lng})
        const bbox = [lng - boxSize, lat - boxSize, lng + boxSize, lat + boxSize]
        const request = {"elems":[{"name":"maxt","interval":"dly","duration":"dly","normal":"91","prec":2},{"name":"mint","interval":"dly","duration":"dly","normal":"91","prec":2},{"name":"avgt","interval":"dly","duration":"dly","normal":"91","prec":2}],"sDate":"2010-01-01","eDate":"2010-12-31","meta":["name","state","ll","sids"],"bbox":bbox}
        //fetch station list from acis
        const res = await fetch('https://data.rcc-acis.org/StnMeta',
            {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(request)}
        )
        const data = await res.json()
        const stations = data.meta
        props.setStationList(stations)
        //Display stations on map
        const map = mapRef.current
        const markerGroup = markerGroupRef.current
        markerGroup.removeFrom(map)
        markerGroup.clearLayers()
        map.removeLayer(rect.current)
        for (let station of stations){
            const newMarker = L.marker([station.ll[1], station.ll[0]], {icon: L.icon({iconAnchor: [13, 37], iconUrl: "/images/marker-icon.png", shadowUrl: "/images/marker-shadow.png"})})
            newMarker.on('click', () => clickStation(station))
            markerGroup.addLayer(newMarker)
        }
        console.log(markerGroup)
        markerGroup.addTo(map)
    }
    
    return(
        <div className="map-component-frame">
            <div className="location-search">
                <button className="locate-button" onClick={locateUser}>Locate</button>
                <div style={{width: "20px"}}></div>
                <input type="text" className="location-search-bar" placeholder="Search location.." onChange={(e) => {setLocSearch(e.target.value)}} onKeyDown={enterHandler}></input>
                <button className="location-search-button" onClick={searchHandler}>Search</button>
                <div className="location-picker" style={{"visibility": locVisible ? "visible" : "hidden"}}>
                    {
                        locData.map((item, index) => {
                            const loc = item.name
                            const country = item.country_code
                            const lat = item.latitude
                            const lng = item.longitude
                            const locString = `${loc}, ${item.admin1}, ${country} (${lat}, ${lng})`
                            return <div key={"loc" + index} className="location-item" onClick={() => clickLocation(lat, lng)}>{locString} </div>
                        })
                    }
                </div>
            </div>
            <div className="map-frame">
                <MapContainer ref={mapRef} center={center} zoom={10} minZoom={3} worldCopyJump={true} style={{height: isMobile ? "450px" : "700px", width: "1fr"}}>
                
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        noWrap={false}
                    />
                    <ClickHandler />
                        
                </MapContainer>
            </div>
            <div className="station-fetch-bar control-bar">
                <h2 className="selected">Selected location: {Math.abs(props.clickedCoords.lat.toFixed(2))} {props.clickedCoords.lat > 0 ? "N" : "S"}, {Math.abs(props.clickedCoords.lng.toFixed(2))} {props.clickedCoords.lng > 0 ? "E" : "W"}</h2>
                <button className="selectButton" onClick={fetchStationsAndDisplay}>Get Stations</button>
            </div>
        </div>
    )

}

export default MapComponent