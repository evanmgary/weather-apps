import React, { useState, useRef } from "react";
import L from 'leaflet'
import "leaflet/dist/leaflet.css" 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import { isMobile } from "react-device-detect"
import "./MapComponent.css"

function MapComponent(props){
    const mapRef = useRef()
    const center = {lat: 30.05, lng: -90.00}
    const [locSearch, setLocSearch] = useState("")
    const [locData, setLocData] = useState([])
    const marker = useRef(null)
    const [locVisible, setLocVisible] = useState(false)

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
        map.flyTo(latlng, 8)
        if (marker.current){
            map.removeLayer(marker.current)
        }
        const newMarker = new L.marker(latlng, {icon: L.icon({iconAnchor: [13, 37], iconUrl: "/images/marker-icon.png", shadowUrl: "/images/marker-shadow.png"})})
        //setMarker(newMarker)    
        marker.current = newMarker
        if (marker.current){
            map.addLayer(marker.current)
        }
        setLocVisible(false)
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
        </div>
    )

}

export default MapComponent