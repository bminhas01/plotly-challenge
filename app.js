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

    function init(){
        var selectedID  = "940";
        importedData.samples.forEach((row) =>{
            Object.entries(row).forEach(([key, value])=>{
                if (selectedID === value){
                    var filteredOtu_ids = row.otu_ids.slice(0,10);
                    var filteredSample_values = row.sample_values.slice(0,10);
                    var filteredOtu_labels = row.otu_labels.slice(0,10);

                    dataBar = [{
                        x: filteredSample_values,
                        y: filteredOtu_ids,
                        text: filteredOtu_labels,
                        type: "bar",
                        orientation: 'h'
                    }];

                    var barLayout = {
                        yaxis : {
                            tickprefix: "OTU ID "
                        }
                    }
            
                    Plotly.newPlot("bar", dataBar, barLayout);
                };
            });
        });
    }

    d3.selectAll('#selDataset').on("change", updatePlotly);

    function updatePlotly(){
        var selectedID  = d3.select('#selDataset').node().value;
        
        importedData.samples.forEach((row) =>{
            Object.entries(row).forEach(([key, value])=>{
                if (selectedID === value){
                    var filteredOtu_ids = row.otu_ids.slice(0,10);
                    var filteredSample_values = row.sample_values.slice(0,10);
                    var filteredOtu_labels = row.otu_labels.slice(0,10);

                    var xBar = [];
                    var yBar = [];

                    xBar = filteredSample_values,
                    yBar = filteredOtu_ids,
            
                    Plotly.restyle("bar", "x", [xBar]);
                    Plotly.restyle("bar", "y", [yBar]);
                };
            });
        });
    };

init();

})
