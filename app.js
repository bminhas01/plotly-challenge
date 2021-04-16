
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

    var selectedID  = d3.select('#selDataset').node().value
    
    importedData.samples.forEach((row) =>{
        Object.entries(row).forEach(([key, value])=>{
            if (selectedID === value){
                var filteredOtu_ids = row.otu_ids.slice(0,10)
                console.log(filteredOtu_ids)
                var filteredSample_values = row.sample_values.slice(0,10)
                console.log(filteredSample_values)
                var filteredOtu_labels = row.otu_labels.slice(0,10)
                console.log(filteredOtu_labels)
            }
        })
    })
    



    

    // function filteredList(selectedID){
    //     return importedData.metadata.id === selectedID
    // }
    
    // d3.selectAll('#selDataset').on("change", updatePlotly);

    // function updatePlotly(){

    // }
        
})
