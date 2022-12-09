var width = d3.select('.pieChart').node().getBoundingClientRect().width;
var height = width;

// Add brushing
const brush = d3.brushX()  
.extent( [ [0,0], [width,height] ] )  
.on("end", updateChart)  

