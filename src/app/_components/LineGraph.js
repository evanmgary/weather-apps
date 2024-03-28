import Dygraph from "dygraphs"
import "../_components/dygraphs.css"
import { useEffect, useRef } from "react"
export default function LineGraph(props){
    const data = props.data
    const el = useRef()
    
    
    function cToF(temp){
        return temp * (9/5) + 32
    }

    useEffect(()=> {
        const fields = [...props.fields]
        fields.unshift("date")
        const colors = ["red", "blue", "green", "yellow", "orange"]
        let graphData = []
        for (let i = 0; i < data["date"].length; i++){
            let arr = []
            for (let field of fields){
                
                if (data[field][i] == "MM"){
                    arr.push(null)
                }
                else if (field == "date"){
                    arr.push(new Date(data[field][i]))
                }
                else{
                    if(["ATMP", "WTMP", "DEWP"].includes(field)){
                        arr.push(cToF(parseFloat(data[field][i])))
                    }
                    else{
                        arr.push(parseFloat(data[field][i]))
                    }
                }
                
            }
            graphData.push(arr)
        }

        const g = new Dygraph(el.current, graphData, {
            labels: fields,
            colors: colors.slice(0, fields.length - 1),
            rollPeriod: props.rollPeriod,
            showRoller: false,
            ylabel: fields.includes("ATMP") ? "Temperature (F)" : "Wind Speed (kts)"})
    })
 
    return(
        
        <div className="flex-column mt-10px justify-center items-center">
            <h2 className="mt-10 text-center">{props.graph1Desc}</h2>
            <div id="dygraph" ref={el} className="dygraph border-4 mt-7 mx-auto" style={{"height": "500px", "width": "800px"}}></div>
        </div>
    )
}