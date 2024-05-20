import React from 'react'
import './CurrentBar.css'

function CurrentBar(props){
    return(
        <div className='current-bar'>
            <div className='all-temp-data'>
                <div className='day-temps'>
                    <h1 className='current-temp'>{props.current.temperature.toFixed(1)}°</h1>
                    <h3 className='day-high-low'>{props.current.highTemp.toFixed(1)}° | {props.current.lowTemp.toFixed(1)}°</h3>
                </div>
                <div className='other-temp-data'>
                    <h3 className='other-data'><span className='other-label'>APPARENT</span>   <span className='other-value'>{props.current.apparent.toFixed(1)}°</span></h3>
                    <h3 className='other-data'><span className='other-label'>WET BULB</span>   <span className='other-value'>{props.current.wetbulb.toFixed(1)}°</span></h3>
                    <h3 className='other-data'><span className='other-label'>DEW POINT</span>   <span className='other-value'>{props.current.dewpoint.toFixed(1)}°</span></h3>
                </div>
            </div>
            <div className='precip-data'>
                <h3 className='precip-chance'><span className='precip-label'>Next 25% Precipitation:</span>   <span className='precip-value'>{props.current.nextPrecip25}</span></h3>
                <h3 className='precip-chance'><span className='precip-label'>Next 75% Precipitation:</span>   <span className='precip-value'>{props.current.nextPrecip75}</span></h3>

            </div>
        </div>
    )
}

export default CurrentBar