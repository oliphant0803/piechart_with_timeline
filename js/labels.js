function labelCatChart() {

    var paras = document.getElementsByClassName('arcLabelWedge');

    while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
    }

    //outer cat label
    let catLabelArcs = svg.selectAll('.arcLabelWedge')
    .data(piedata.slice(-dataSet.radius.length))
    .enter()
    .append('g')
    .classed('arcLabelWedge',true)
    .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')')

    catLabelArcs.append('path')
    .attr('d', arc)
    .attr('fill', 'none')

    catLabelArcs
    .filter(function(d) { 
        return d.endAngle - d.startAngle >= Math.PI/8; 
    })
    .append("g:text")
    .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d) {
        if(!isNaN(d.data.label)){
            return d.data.label + " " + cat_title;
        }
        return d.label;     
    })
    .filter(function(d) { 
        return d.startAngle >= 3*Math.PI/2 || d.endAngle >= 3*Math.PI/2; 
    })
    .classed("flipText", true)
}

function labelChart() {

    //clean up
    paras = document.getElementsByClassName('arcTimeWedge');

    while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
    }

    svg
    .append("g")
    .classed('arcTimeWedge',true)
    .attr("transform","translate("+width/2 +","+(height+10)/2+")")
    .append("text")
    .classed("currTimeLabel", true)
   .attr("text-anchor", "middle")
   .text(currTime);

    let selected_data = piedata.filter(function(d){
        return !d.data.dummy && d.data.radius != 0 && Math.abs(d.endAngle - d.startAngle) >= Math.PI/8;
    })

    //do label
    let timeLabelArcs = svg.selectAll('.arcTimeWedge')
    .data(selected_data)
    .enter()
    .append('g')
    .classed('arcTimeWedge',true)
    .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')')

    timeLabelArcs.append('path')
    .attr('d', arc)
    .attr("id", function(d, i) { 
        return i; 
    })
    .attr('fill', 'none')

    timeLabelArcs
    .filter(function(d) { 
        var middle_angle = (d.startAngle + d.endAngle)/2
        return middle_angle <= Math.PI/4; 
    })
    .append("g:text")
    .classed("innerText", function(d) {
        return d.data.selected;
    })
    .attr("transform", function(d) {
        return "translate(" + timeFirstArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d) {
        return abbreviateNumber(d.data.radius);    
    });

    timeLabelArcs
    .filter(function(d) { 
        var middle_angle = (d.startAngle + d.endAngle)/2
        return middle_angle >= 5*Math.PI/4 && middle_angle <= 7 * Math.PI/4 && middle_angle > Math.PI/4; 
    })
    .append("g:text")
    .classed("innerText", function(d) {
        return d.data.selected;
    })
    .attr("transform", function(d) {
        return "translate(" + timeOppArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d) {
        return abbreviateNumber(d.data.radius);    
    });

    timeLabelArcs
    .filter(function(d) { 
        var middle_angle = (d.startAngle + d.endAngle)/2
        return (middle_angle < 5*Math.PI/4 || middle_angle > 7 * Math.PI/4) && middle_angle > Math.PI/4; 
    })
    .append("g:text")
    .classed("innerText", function(d) {
        return d.data.selected;
    })
    .attr("transform", function(d) {
        return "translate(" + timeFronArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d) {
        return  abbreviateNumber(d.data.radius);    
    });

    timeLabelArcs
    .append("g:text")
    .classed("innerText", function(d) {
        return d.data.selected;
    })
    .append("textPath")
    .attr("href", function(d, i){
        return '#'+i;
    })
    .attr("alignment-baseline", "hanging")
    .attr("text-anchor", "start")
    //transition angle if d.startangle is larger than Math.PI and smaller than 3*Math.PI/2
    .text( function(d) {
        return d.data.time;    
    })
    .attr('fill', function(d) {
        if(d.data.selected){
            return "none";
        }
    });
    //textPath doesnt support transform

    // timeLabelArcs
    // .select('.try')
    // .attr("transform", function(d) {
    //     var box = d3.select(this).node().getBoundingClientRect();
    //     console.log(box.x, width)
    //     //console.log((box.x-width), (box.y-width));
    //     return "rotate(" + timeAngle(d) + "," + (-20) + "," + (20) + ")";
    // })
}

function timeAngle(d) {
    if (d.startAngle <= 3*Math.PI/2 && d.startAngle >= Math.PI){
        return 180;
    }else{
        return 0;
    }
}

function abbreviateNumber(num) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol : "0";
  }



function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI;
    return a > 90 ? a - 180 : a;
}

// alignemtn on baseline
// text on path

// task: change label
// start survey questions
//shorten the value
//current year in center
//tooltip anywhere