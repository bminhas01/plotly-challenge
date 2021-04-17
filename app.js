// Create init function to load visuals when page is opened
function init() {
    // Load data from samples.json and save id values
    d3.json("data/samples.json").then((importedData) => {
        var idOptions = importedData.names;
        idOptions.forEach((item) => {
            d3.select("#selDataset")
                .append("option")
                .attr("value", item)
                .text(item);
        });

        // Call other functions with the argument for the first (default) Subject ID
        demographicTable(idOptions[0]);
        buildGraph(idOptions[0]);
        buildGauge(idOptions[0]);

    });
};

// Create a function to load Demographic information for selected Subject ID
function demographicTable(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        d3.select('#sample-metadata').html("")
        var metadataOptions = importedData.metadata;
        // Extract metadata for selected Subject ID value
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

// Create function to build bar graph and bubble chart based on selected Subject ID
function buildGraph(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        var sampleOptions = importedData.samples;
        // Extract OTU information for Selected ID value
        sampleOptions.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
                if (selectedID === value) {
                    var filteredOtu_ids = row.otu_ids;
                    var filteredSample_values = row.sample_values;
                    var filteredOtu_labels = row.otu_labels;

                    // Create data variable to hold values for top 10 OTU IDs for the Bar Graph
                    dataBar = [{
                        x: filteredSample_values.slice(0, 10).reverse(),
                        y: filteredOtu_ids.slice(0, 10).map(x => `OTU ID ${x}`).reverse(),
                        text: filteredOtu_labels.slice(0, 10).reverse(),
                        type: "bar",
                        orientation: 'h'
                    }];

                    // Create data variable for the Bubble chart using entire dataset
                    dataBubble = [{
                        x: filteredOtu_ids,
                        y: filteredSample_values,
                        mode: 'markers',
                        text: filteredOtu_labels,
                        marker: {
                            colorscale: "Portland",
                            color: filteredOtu_ids,
                            size: filteredSample_values
                        }
                    }];

                    // Specify title for the Bubble Chart and hide the legend
                    var layoutBubble = {
                        showlegend: false,
                        xaxis: {
                            title: "OTU ID"
                        }

                    };

                    // Plot the Bar Graph and Bubble Chart
                    Plotly.newPlot("bar", dataBar);
                    Plotly.newPlot("bubble", dataBubble, layoutBubble);
                };
            });
        });
    });
};

// Create a function to build the Gauge Chart
function buildGauge(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        d3.select('#gauge').html("")
        var sampleOptions = importedData.metadata;

        // Extract weekly frequency information for selected subject ID
        sampleOptions.forEach((record) => {
            Object.entries(record).forEach(([key, value]) => {
                if (+selectedID === value) {
                    var weeklyFreq = +record.wfreq;

                    // Specify layout of svg
                    var svgwidth = 1000;
                    var svgheight = 400;

                    var svg = d3.select("#gauge")
                        .append("svg")
                        .attr("width", svgwidth)
                        .attr("height", svgheight);

                    var g = svg.append("g")
                        .attr("transform", "translate(200,300)");
                    
                    // Create variables for weekly frequency options and gauge colors
                    var freqOptions = ["1", "2", "3", "4", "5", "6", "7", '8', "9"];

                    gaugeColors = ["rgba(224, 224, 224, 0.6)", "rgba(255, 255, 153, 0.6)",
                        "rgba(204, 255, 153, 0.6)", "rgba(153, 255, 153, 0.6)", "rgba(125, 202, 75, 0.6)",
                        "rgba(51, 255, 51, 0.6)", "rgba(0, 204, 0, 0.6)", "rgba(0, 153, 76, 0.6)",
                        "rgba(0, 102, 51, 0.6)"];

                    // Use d3 pie method to create gauge
                    var pie = d3.pie()
                        .startAngle((-1 * Math.PI) / 2)
                        .endAngle(Math.PI / 2)
                        .value(function (gaugeColors) {
                            return 100 / gaugeColors.length;
                        });
                    
                    // Use d3 arc method to speciy inner and outer radius of gauge
                    var path = d3.arc()
                        .innerRadius(60)
                        .outerRadius(130)
                        .padAngle(0);

                    var label = d3.arc()
                        .innerRadius(90)
                        .outerRadius(125)
                        .padAngle(0);

                    // Populate gauge and apply colors
                    var arc = g.selectAll('.arc')
                        .data(pie(freqOptions))
                        .enter()
                        .append('g')
                        .classed("class", true);

                    arc.append("path")
                        .attr("d", path)
                        .style("fill", function (d, i) {
                            return gaugeColors[i]
                        });

                    // Create needle and apply attributes
                    needle = g.selectAll(".needle")
                        .data([weeklyFreq])
                        .enter()
                        .append('line')
                        .attr("x1", 0)
                        .attr("x2", -80)
                        .attr("y1", 0)
                        .attr("y2", 0)
                        .classed("needle", true)
                        .style("stroke", "red")
                        .style("stroke-width", "5")
                        .attr("transform", function (d) {
                            return " rotate(" + d * 20 + ")"
                        });
                    
                    // Apply text to gauge sections
                    var textValues = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"];

                    arc.append("text")
                        .attr("transform", function (d) {
                            return "translate (" + label.centroid(d) + ")";
                        })
                        .text(function (d, i) {
                            return textValues[i]
                        })
                        .attr("color", "black");
                    
                    // Add a Title to the Gauge Chart visual
                    g.append("text")
                        .attr("y", -200)
                        .attr("x", -115)
                        .style("font-size", "16px")
                        .style("stroke", "black")
                        .text("Belly Button Washing Frequency")
                        .classed("title", true);

                    g.append("text")
                        .attr("y", -175)
                        .attr("x", -65)
                        .style("font-size", "16px")
                        // .style("stroke", "black")
                        .text("Scrubs per Week")
                        .classed("subtitle", true);


                };
            });
        });
    });
};

// Create a function to change visuals when another subject ID is selected
function optionChanged(newsample) {
    demographicTable(newsample);
    buildGraph(newsample);
    buildGauge(newsample);

};

// Call init function so it runs when the page is loaded
init();
