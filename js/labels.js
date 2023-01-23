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
    // .filter(function(d) { 
    //     return d.endAngle - d.startAngle >= Math.PI/8; 
    // })
    .append("g:text")
    .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d) {
        var labelName = "";
        if(!isNaN(d.data.label)){
            labelName = d.data.label + " " + cat_title;
        }else{
            labelName = d.label;   
        }
        if(d.endAngle - d.startAngle >= Math.PI/8){
            return labelName;
        }else{
            return shortName(labelName);
        }
  
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

    paras = document.getElementsByClassName('smallArcTimeWedge');

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
        return !d.data.dummy && d.data.radius != 0;
    })

    //do label
    let timeLabelArcs = svg.selectAll('.arcTimeWedge')
    .data(selected_data)
    .enter()
    .append('g')
    .classed('arcTimeWedge',true)
    .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')')

    labelArcs(timeLabelArcs);

    // let small_area_data = piedata.filter(function(d){
    //     return !d.data.dummy && d.data.radius != 0 && Math.abs(d.endAngle - d.startAngle) < Math.PI/8;
    // })

    // let small_timeLabelArcs = svg.selectAll('.smallArcTimeWedge')
    // .data(small_area_data)
    // .enter()
    // .append('g')
    // .classed('smallArcTimeWedge',true)
    // .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')')

    //labelArcs(small_timeLabelArcs);
}

function labelArcs(dataArcs) {
    dataArcs.append('path')
    .attr('d', arc)
    .attr("id", function(d, i) { 
        return i; 
    })
    .attr('fill', 'none')

    dataArcs
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

    dataArcs
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

    dataArcs
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

    dataArcs
    .append("g:text")
    .classed("rotateTime", true)
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

    dataArcs
    .select('.rotateTime')
    .attr("transform", function(d) {
        var box = d3.select(this).node().getBBox();
        // console.log(box.x, box.y)
        // console.log(box);
        return "rotate(" + timeAngle(d) + "," + (box.x+box.width/2) + "," + (box.y+box.height/2-2) + ")";
        // translate(" + (box.x) + "," + (box.y) + ") 
    })

    svg.selectAll('.arcTimeWedge')
    .each(function(d, i) {
        //console.log(d3.select(this).node());
        var currNode = d3.select(this).node();
        console.log(d3.select(this));
        if(d3.select(this).node().childNodes.length == 3){
            console.log(currNode.childNodes[0]);
            var arcPathNode = currNode.childNodes[0];
            var arcTextNode = currNode.childNodes[1];
            var arcTimeNode = currNode.childNodes[2];
            if(arcPathNode.getBBox().width <= arcTextNode.getBBox().width || arcPathNode.getBBox().width <= arcTimeNode.getBBox().width){
                arcTextNode.style.display = "none";
                arcTimeNode.style.display = "none";
            }
        }

    })
}

function timeAngle(d) {
    var middle_angle = (d.startAngle + d.endAngle)/2
    if ((d.startAngle <= 3*Math.PI/2 && d.startAngle >= Math.PI )|| (middle_angle >= Math.PI && middle_angle <= 3/2*Math.PI)){
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
    return a > 90 && a < 270 ? a - 180 : a;
}