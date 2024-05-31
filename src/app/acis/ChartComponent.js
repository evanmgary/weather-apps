import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import "./ChartComponent.css"

function ChartComponent(props){
    const colors = {
        max_temperature: "red", min_temperature: "blue", avg_temperature: "green", record_high: "orange", record_low: "purple"
    }

    const dateTicks = (item) =>{
        const date = new Date(item + "T00:00:00")
        console.log(date)
        const month =  date.getMonth() + 1
        const day = date.getDate()

        return `${month}/${day}`
    }

    function customTooltip({active, payload, label}){
        
        if (active && payload && payload.length){
            const payloadObj = payload[0].payload
            console.log(payloadObj)
            return(
            <div className="custom-tooltip" style={{border: "2px solid black", height: "70px", width: "90px"}}>
                {Object.keys(payloadObj).map((key) => {
                    key.includes("record") ? <p className='tooltip-data'>{`${key}: ${payloadObj[key]}${props.unit} (${payloadObj[key + "_year"]})`}</p> : <p className='tooltip-data'>{`${key}: ${payloadObj[key]}${props.unit}`}</p> 
                })}
            </div>)
        }
        return null
    }
    // <Tooltip formatter={(value, name) => [`${value}${props.unit}`, name.replace("_", " ")]} labelFormatter={dateTicks}/>

    return(
        <div className="chartComponent">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={230}
                    data={props.data}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tickFormatter={dateTicks} angle={-70} tickMargin={32} height={90}/>
                    <YAxis domain={([dataMin, dataMax]) => [(Math.floor((dataMin - 10) / 10)) * 10, (Math.floor((dataMax + 10) / 10)) * 10]} unit={props.unit} allowDecimals={false}/>
                    <Tooltip formatter={(value, name) => [`${value}${props.unit}`, name.replace("_", " ")]} labelFormatter={dateTicks}/>
                    <Legend formatter={(value) => value.replace("_", " ")} />
                    {
                        props.variables.map(item => {
                            return(
                                    <Line key="" type={item.includes("record") ? "step" :"monotone"} dataKey={item} stroke={colors[item]} strokeWidth={item.includes("record") ? 0 : 2} activeDot={{r: 5}} dot={item.includes("record") ? {stroke: colors[item], strokeWidth: 3} : false}/>
                            )
                        })
                    }
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChartComponent