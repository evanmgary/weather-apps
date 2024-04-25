import { NextResponse } from 'next/server'
import testData from '../../_data/test.json'
import parseData from '@/app/ParseData'

export async function GET(request, {params}){
    const res = await fetch("http://localhost:3000/NWCL1.txt")

    if (!res.ok){
        return NextResponse.json({error: "Could not obtain data"})
    }
    const text = await res.text()
    const parsed = parseData(text.split('\n'), true)
    return NextResponse.json(parsed)
}