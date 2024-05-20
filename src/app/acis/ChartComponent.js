import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import "./ChartComponent.css"

function ChartComponent(props){
    const colors = {
        max_temperature: "red", min_temperature: "blue", avg_temperature: "green", record_high: "orange", record_low: "purple"
    }

    const dateTicks = (item) =>{
        const date = new Date(item)
        const month =  date.getMonth() + 1
        const day = date.getDay()

        return `${month}/${day}`
    }

    function customTooltip({active, payload, label}){
        if (active && payload && payload.length){
            <div className="custom-tooltip">
                {Object.keys(payload).map((key) => {
                    key.contains("record") ? <p className='tooltip-data'>{`${key}: ${payload.key}${props.unit} (${payload[key + "_year"]})`}</p> : <p className='tooltip-data'>{`${key}: ${payload.key}${props.unit}`}</p> 
                })}
            </div>
        }
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
                    <XAxis dataKey="date" tickFormatter={dateTicks}/>
                    <YAxis domain={props.unit === "°" ? ([dataMin, dataMax]) => [(Math.floor((dataMin - 10) / 10)) * 10, (Math.floor((dataMax + 10) / 10)) * 10] : [0, 100]} unit={props.unit} allowDecimals={false}/>
                    <Tooltip formatter={(value, name) => [`${value}${props.unit}`, name.replace("_", " ")]} labelFormatter={dateTicks}/>
                    <Legend formatter={(value) => value.replace("_", " ")} />
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