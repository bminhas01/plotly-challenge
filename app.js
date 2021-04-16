d3.json("data/samples.json").then((Data) => {
    console.log(Data)
    var idOptions = Data.names
    console.log(idOptions)
    idOptions.forEach((item) => {
        d3.select("#selDataset")
        .append("option")
        .attr("value", item)
        .text(item)
    })
})