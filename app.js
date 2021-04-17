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
        buildGauge(idOptions[0]);

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

function buildGauge(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        var sampleOptions = importedData.metadata;
        sampleOptions.forEach((record) => {
            Object.entries(record).forEach(([key, value]) => {
                if (+selectedID === value) {
                    var weeklyFreq = record.wfreq

                    var dataGauge = [{
                        type: "pie",
                        showlegend: false,
                        hole: 0.5,
                        rotation: 90,
                        values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100],
                        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
                        direction: "clockwise",
                        textinfo: "text",
                        textposition: "inside",
                        marker: {
                            colors: ["rgba(224, 224, 224, 0.6)", "rgba(255, 255, 204, 0.6)", "rgba(204, 255, 153, 0.6)", "rgba(178, 255, 102, 0.6)", "rgba(153, 255, 51, 0.6)", "rgba(51, 255, 51, 0.6)", "rgba(0, 204, 0, 0.6)", "rgba(0, 153, 76, 0.6)", "rgba(0, 102, 51, 0.6)", "white"]
                        },
                        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
                        hoverinfo: "label"
                    }]
                    

                    // var h = 0.24
                    // var k = 0.5
                    // var r = 0.5
                    // var c = 0.25
                    // // theta = (100 - weeklyFreq) * 180 / 100
                    // // theta = theta * Math.PI / 180
                    // // x = h + r*Math.cos(theta)
                    // // y = k + r*Math.sin(theta)
                    // // path = 'M 0.235 0.5 L ' + str(x) + ' ' + str(y) + ' L 0.245 0.5 Z'

                    // var degrees = 180 - weeklyFreq;
                    // var radians = degrees * Math.PI / 180;
                    // var x = r * Math.cos(radians);
                    // var y = r * Math.sin(radians);
                    // var path = `M 0.235 0.5 L ${x.toString()} ${y.toString()} L 0.245 0.5 Z`;
                   
                    var svg = d3.select("#gauge")
                        .append("svg")

                    var needle = svg.selectAll(".needle")
                        .data(weeklyFreq)
                        .enter()
                        .append('line')
                        .attr("x1", 0)
                        .attr("x2", -78)
                        .attr("y1", 0)
                        .attr("y2", 0)
                        .classed ("needle", true)
                        .style("stroke", "red")
                        .attr("transform", function (d) {
                            return " translate(200,200) rotate(" + d + ")"
                        } )
                        console.log(svg.selectAll(".needle"))


                    
                    
                    Plotly.newPlot("gauge", dataGauge)
                };
            });
        });
    })
}

function optionChanged(newsample) {
    demographicTable(newsample);
    buildGraph(newsample);
    buildGauge(newsample)
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
