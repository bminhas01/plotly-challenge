function init() {
    d3.json("data/samples.json").then((importedData) => {
        // Create a variable to hold subject IDs
        // Populate dropdown menu with the id values
        var idOptions = importedData.names;
        idOptions.forEach((item) => {
            d3.select("#selDataset")
                .append("option")
                .attr("value", item)
                .text(item);
        });
        buildtable(idOptions[0])
        buildchart(idOptions[0])
    });
}

function optionChanged(newsample) {
    buildtable(newsample)
    buildchart(newsample)
}
function buildtable(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        d3.select('#sample-metadata').html("")
        var metadataOptions = importedData.metadata;
        metadataOptions.forEach((record) => {
            Object.entries(record).forEach(([key, value]) => {
                if (+selectedID === value) {
                    Object.entries(record).forEach(([key, value]) => {
                        d3.select('#sample-metadata')
                            .append("li")
                            .text(`${key}: ${value}`)
                    })
                }
            })
        })
    })
}
    function buildchart(id) { }
    init()