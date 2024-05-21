'use client'
import { useState } from "react"
import SearchControl from "./SearchControl"
//import LineGraph from "../_components/LineGraph"
import dynamic from "next/dynamic"
const LineGraph = dynamic(() => import('./LineGraph.js'), {
    ssr: false,
  })

import testdata from "../_data/test.json"
export default function Page(){
    const [data, setData] = useState(testdata)
    const [graph1Desc, setGraph1Desc] = useState("Please enter a station above.")
    return(
        <div>
            <h1 className="text-center font-bold text-lg mb-12">Buoy Grapher</h1>
            <SearchControl setData={setData} setGraph1Desc={setGraph1Desc}/>
            <LineGraph data={data} fields={["ATMP", "WTMP", "DEWP"]} graph1Desc={graph1Desc} rollPeriod={0}/>
            <LineGraph data={data} fields={["WSPD", "GST"]} graph1Desc={""} rollPeriod={60}/>
        </div>
    )
}