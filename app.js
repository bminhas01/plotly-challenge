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
        d3.select('#gauge').html("")
        var sampleOptions = importedData.metadata;
        sampleOptions.forEach((record) => {
            Object.entries(record).forEach(([key, value]) => {
                if (+selectedID === value) {
                    var weeklyFreq = +record.wfreq

                    var svgwidth = 1000;
                    var svgheight = 400;

                    var svg = d3.select("#gauge")
                        .append("svg")
                        .attr("width", svgwidth)
                        .attr("height", svgheight);
                    
                    var g = svg.append("g")
                        .attr("transform", "translate(200,300)")

                    var freqOptions = [ "1","2","3","4","5","6","7",'8',"9"]

                    gaugeColors = ["rgba(224, 224, 224, 0.6)", "rgba(255, 255, 153, 0.6)", 
                    "rgba(204, 255, 153, 0.6)", "rgba(153, 255, 153, 0.6)", "rgba(125, 202, 75, 0.6)", 
                    "rgba(51, 255, 51, 0.6)", "rgba(0, 204, 0, 0.6)", "rgba(0, 153, 76, 0.6)", 
                    "rgba(0, 102, 51, 0.6)"]

                    var pie = d3.pie()
                    .startAngle( (-1*Math.PI) / 2 )
                    .endAngle( Math.PI / 2 )
                    .value( function( gaugeColors ) {
                        return 100 / gaugeColors.length;
                    } );

                    var path = d3.arc()
                        .innerRadius(40)
                        .outerRadius(130)
                        .padAngle(0);
                    
                    var label = d3.arc()
                    .innerRadius(90)
                    .outerRadius(125)
                    .padAngle(0);
                        
                    
                    var arc = g.selectAll( '.arc' )
                    .data(pie(freqOptions))
                    .enter()
                    .append( 'g' )
                    .classed("class", true)

                    arc.append("path")
                    .attr( "d", path )
                    // .attr( "transform", "translate(200,300)" )
                    .style( "fill", function( d, i ) {
                        return gaugeColors[i] 
                    })

                    var needle = g.selectAll( ".needle" )
                    .data([weeklyFreq])
                    .enter()
                    .append( 'line' )
                    .attr( "x1", 0 )
                    .attr( "x2", -78 )
                    .attr( "y1", 0 )
                    .attr( "y2", 0 )
                    .classed("needle", true)
                    .style( "stroke", "red" )
                    .attr( "transform", function( d ) {
                        return " rotate(" + d * 18 + ")"
                    } );

                    var textValues = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"]

                    arc.append("text")
                    .attr("transform", function(d) { 
                                return "translate(" + label.centroid(d) + ")"; 
                        })
                    .text(function( d, i ) {
                        return textValues[i] 
                    })
                    .attr("color", "black");

                
                };
            });
        });
    });
}

function optionChanged(newsample) {
    demographicTable(newsample);
    buildGraph(newsample);
    buildGauge(newsample)

}


init();
