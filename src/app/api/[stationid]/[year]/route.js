import { NextResponse } from 'next/server'
import parseData from '@/app/ParseData'


export async function GET(request, {params}){
    const stationId = params.stationid
    const year = params.year
    const res = await fetch("https://www.ndbc.noaa.gov/view_text_file.php?filename=" + stationId.toLowerCase() + "h" + year +".txt.gz&dir=data/historical/stdmet/")

    if (!res.ok){
        return NextResponse.json({error: "Could not obtain data"})
    }
    const text = await res.text()
    const parsed = parseData(text.split('\n'), false)
    return NextResponse.json(parsed)
}