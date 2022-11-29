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
    //rule: only label the first 2 layers given the piedata

    //clean up
    paras = document.getElementsByClassName('arcTimeWedge');

    while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
    }

    //get the top 2 layers
    let selected_data = piedata.slice(piedata.length - dataSet.radius.length*2);
    selected_data = selected_data.filter(function(d){
        return d.data.dummy == false;
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
    .attr('fill', 'none')

    timeLabelArcs
    .filter(function(d) { 
        return d.endAngle >= Math.PI/2; 
    })
    .append("g:text")
    .attr("transform", function(d) {
        return "translate(" + timeOppArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d) {
        return d.data.radius;    
    });

    timeLabelArcs
    .filter(function(d) { 
        return d.endAngle <= Math.PI/2 && d.startAngle <= Math.PI/2;
    })
    .append("g:text")
    .attr("transform", function(d) {
        return "translate(" + timeFronArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d) {
        return d.data.radius;    
    });
}

function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI;
    return a > 90 ? a - 180 : a;
}