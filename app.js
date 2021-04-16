d3.json("data/samples.json").then((Data) => {
    var idOptions = Data.names;
    idOptions.forEach((item) => {
        d3.select("#selDataset")
        .append("option")
        .attr("value", item)
        .text(item);
    });
});