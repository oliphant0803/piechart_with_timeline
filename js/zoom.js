var width = d3.select('.pieChart').node().getBoundingClientRect().width;
var height = width;

// Add brushing
var brush = d3.brush()                   // Add the brush feature using the d3.brush function
.extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
.on("end", zoomChart)               // Each time the brush selection changes, trigger the 'updateChart' function

// Create the area variable: where both the area and the brush take place
var area = d3.select('.pieChartSvg').append('g')
.attr("clip-path", "url(#clip)")


// Add the brushing
area
.append("g")
.attr("class", "brush")
.call(brush);

// A function that set idleTimeOut to null
var idleTimeout
function idled() { idleTimeout = null; }

// If user double click, reinitialize the chart
d3.select('.pieChartSvg').on("dblclick",function(){
    console.log("double clicked, should redraw pie");
    config.setData(currTime);
    config.setData(currTime);
    config.prepareChart();
    config.prepareData();
    config.plotPie();
  });

// A function that update the chart for given boundaries
function zoomChart() {

    // What are the selected boundaries?
    extent = d3.brushSelection(this);

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    }else{
      var count = 0;
      //find the position of piechartSvg
      const x = document.querySelector('.pieChartSvg').getBoundingClientRect().left;
      const y = document.querySelector('.pieChartSvg').getBoundingClientRect().top;
      //get all elements from pieChartSvg
      var paths = [...document.querySelectorAll('.pieChartSvg path')]; 
      paths.forEach(p => {
        var position = p.getBoundingClientRect();
        if(position.left-x >= extent[0][0] && position.right-x <= extent[1][0] && position.top-y >= extent[0][1] && position.bottom-y <= extent[1][1]){
            p.classList.add("brushed");
            count += 1;
        }
      });
    //   console.log(count);
      area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      if(count == 0){
        return
      }
      console.log("brushed");
    }

    // Update axis and area position
    var zoomTime;
    let arcs = svg.selectAll('.arcWedge')
    .data(piedata,d=>d.data.label + '_' + d.data.time)

    arcs.each(function(d, i) {
        if(d3.select(this).classed('brushed')){
            zoomTime = d.data.time;
        }
    })
    let zoomIndex = piedata.findLastIndex(function(d){
        return d.data.time == zoomTime;
    });
    config.setData(currTime);
    config.setData(currTime);
    piedata = piedata.slice(0, zoomIndex+1);
    console.log(piedata);
    config.prepareChart();
    //change scale
    var max = 0;
    piedata.forEach(d => {
        if(d.data.outer > max){
            max = d.data.outer;
        }
    });
    scale = max/width*2;
    config.plotPie();
  }


