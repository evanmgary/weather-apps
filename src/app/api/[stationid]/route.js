import { NextResponse } from 'next/server'
import parseData from '@/app/ParseData'


export async function GET(request, {params}){
    const stationId = params.stationid
    const res = await fetch("https://www.ndbc.noaa.gov/data/realtime2/" + stationId.toUpperCase() + ".txt", {next: {revalidate: 86400}})

    if (!res.ok){
        return NextResponse.json({error: "Could not obtain data"})
    }
    const text = await res.text()
    const parsed = parseData(text.split('\n'), true)
    return NextResponse.json(parsed)
}