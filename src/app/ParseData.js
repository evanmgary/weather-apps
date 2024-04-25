export default function parseData(data, reverse){
    let splitData = []
    for (let line of data){
        splitData.push(line.split(/\s+/))
    }
    const hasMinute = splitData[0][4] === "mm"
    const labels = splitData.shift()
    if (splitData[0][0][0] === '#'){
        splitData.shift()
    }
    splitData.pop()
    if (reverse){
        splitData.reverse()
    }
    const output = {}
    output.date = []
    if (hasMinute){
        for (let i = 5; i < labels.length; i++){
            output[labels[i]] = []
        }
    }
    else{
        for (let i = 5; i < labels.length; i++){
            output[labels[i]] = []
        }
    } 
    console.log(splitData[1])
    const noDataThreshold ={"WDIR": 998, "WD": 998,"WSPD": 98, "GST": 98, "WVHT": 98, "DPD": 98, "APD" : 98, "MWD": 998, "PRES": 9998,"BAR": 9999, "ATMP": 998, "WTMP": 998, "DEWP": 998, "PTDY": 98, "TIDE" : 998, "VIS": 98}
    //Fill object
    for (let line of splitData){
        let date = null
        let startIndex = 0
        if (parseInt(line[0]) < 100){
            line[0] = "19" + line[0]
        }
        if (hasMinute){
            date = new Date(Date.UTC(parseInt(line[0]), parseInt(line[1]) - 1, parseInt(line[2]), parseInt(line[3]), parseInt(line[4])))
            startIndex = 5
        }
        else{
            date = new Date(Date.UTC(parseInt(line[0]), parseInt(line[1]) - 1, parseInt(line[2]), parseInt(line[3])))
            startIndex = 4
        }
        output["date"].push(date.toISOString())
        for (let i = startIndex; i < splitData[0].length; i++){
            let label = labels[i]
            if ((line[i] === "MM") || (parseFloat(line[i]) > noDataThreshold[label])){
                output[label].push("MM")
            }
            else{
                output[label].push(line[i])
            }
        }
    }

    return output
}