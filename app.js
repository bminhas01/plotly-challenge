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

        demographicTable(idOptions[0]);
        buildGraph(idOptions[0]);

    });
};

function demographicTable(selectedID) {
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
                    });
                };
            });
        });
    });
};

function buildGraph(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        var sampleOptions = importedData.samples;
        sampleOptions.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
                if (selectedID === value) {
                    var filteredOtu_ids = row.otu_ids;
                    var filteredSample_values = row.sample_values;
                    var filteredOtu_labels = row.otu_labels;

                    dataBar = [{
                        x: filteredSample_values.slice(0, 10).reverse(),
                        y: filteredOtu_ids.slice(0, 10).map(x => `OTU ID ${x}`).reverse(),
                        text: filteredOtu_labels.slice(0, 10).reverse(),
                        type: "bar",
                        orientation: 'h'
                    }];

                    dataBubble = [{
                        x: filteredOtu_ids,
                        y: filteredSample_values,
                        mode: 'markers',
                        text: filteredOtu_labels,
                        marker: {
                            // color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
                            colorscale: "Portland",
                            color: filteredOtu_ids,
                            size: filteredSample_values
                        }
                    }];

                    var layoutBubble = {
                        showlegend: false,
                        xaxis: {
                            title: "OTU ID"
                        }

                    }

                    Plotly.newPlot("bar", dataBar);
                    Plotly.newPlot("bubble", dataBubble, layoutBubble);
                };
            });
        });
    });
};

function optionChanged(newsample) {
    demographicTable(newsample);
    buildGraph(newsample);
}




// d3.selectAll('#selDataset').on("change", updatePlotly);

// function updatePlotly(selectedID) {
//     d3.json("data/samples.json").then((importedData) => {
//         var sampleOptions = importedData.samples;
//         var selectedID = d3.select('#selDataset').node().value;

//         sampleOptions.forEach((row) => {
//             Object.entries(row).forEach(([key, value]) => {
//                 // if (selectedID === value) {
//                 var filteredOtu_ids = row.otu_ids;
//                 var filteredSample_values = row.sample_values;
//                 var filteredOtu_labels = row.otu_labels;

//                 var xBar = [];
//                 var yBar = [];

//                 xBar = filteredSample_values.slice(0, 10).reverse(),
//                     yBar = filteredOtu_ids.slice(0, 10).map(x => `OTU ID ${x}`).reverse(),

//                     Plotly.restyle("bar", "x", [xBar]);
//                 Plotly.restyle("bar", "y", [yBar]);

//                 var xBubble = [];
//                 var yBubble = [];

//                 xBubble = filteredOtu_ids,
//                     yBubble = filteredSample_values

//                 Plotly.restyle("bubble", "x", [xBubble]);
//                 Plotly.restyle("bubble", "y", [yBubble]);

//                 // };
//             });
//         });
//     });
// demographicTable(selectedID)
// buildGraph(selectedID)

// };

init();
