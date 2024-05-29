import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import "./ChartComponent.css"

function ChartComponent(props){
    const colors = {
        temperature_2m: "blue", dewpoint_2m: "green", apparent_temperature: "red", precipitation_probability: "skyblue", cloudcover: "grey", wetbulb_temperature_2m: "orange"
    }

    const timeTicks = (item) =>{
        const time = new Date(item)
        const hour = time.getHours()
        return `${time.getMonth() + 1}/${time.getDate()} ${hour < 12 ? (hour === 0 ? 12 : hour) + "AM" : (hour === 12 ? 12 : hour - 12) + "PM"}`
    } 


    
    return(
        <div className="chartComponent">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={230}
                    data={props.data}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="time" tickFormatter={timeTicks} tickCount={6} interval={11}/>
                    <YAxis domain={props.unit === "°" ? ([dataMin, dataMax]) => [(Math.floor((dataMin - 10) / 10)) * 10, (Math.floor((dataMax + 10) / 10)) * 10] : [0, 100]} unit={props.unit} allowDecimals={false}/>
                    <Tooltip formatter={(value, name) => [`${value}${props.unit}`, name.replace("_2m", "").replace("_", " ")]} labelFormatter={timeTicks}/>
                    <Legend formatter={(value) => value.replace("_2m", "").replace("_", " ")} />
                    {
                        props.variables.map(item => {
                            return(
                                    <Line key="" type="monotone" dataKey={item} stroke={colors[item]} activeDot={{r: 5}} dot={false} />
                            )
                        })
                    }
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChartComponent