// Note: for animation and fancy styling, https://www.amcharts.com/demos/variable-radius-pie-chart/ is an library to enhance the visualization for pie chart that I found, but not sure if I can use it
var graphData = {}; 

// windows add event listener when click on enlarge #enlarge
// config.setDataLarge(graphData.rows[0]);


//https://www.d3indepth.com/enterexit/
//use the latest d3 version
// update exit enter

const colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }; 


function read_data(data){
    data = JSON.parse(data);
    graphData.cols = [];
    graphData.rows = get_rows(data);
    graphData.stats = get_stats(data);
    var catagories = get_titles(data);
    console.log(catagories);
    var COLORS = interpolateColors(catagories.length, colorRangeInfo);
    console.log(COLORS);
    catagories.forEach((cat) => {
        graphData.cols.push({"title": cat});
    });
    for(var i =0; i<catagories.length; i++){
        count_freq(data, catagories[i], i, COLORS);
    }
    console.log(graphData);
    config.setData(graphData.rows[0]);
}

function calculate_sum(statsByTime, stat){
    var total = 0;
    for(var i=0; i<statsByTime.length; i++){
        total += Number(statsByTime[i][stat]);
    }
    return total;
}

// count the frequency of the catogorical variables
function count_freq(data, title, index, colors){
    var stats = get_stats(data);
    graphData.cols[index].stats = [];
    graphData.cols[index].color = colors[index];
    var filtered = data.filter(function(x) { return x[stats[2]] == title;})
    if (filtered.length > 0){
        graphData.rows.forEach((time) => {
            var statsByTime = filtered.filter(function(x) { return x[stats[0]] == time});
            if(statsByTime.length > 0){
                var statsByTimeObject = {
                    "time": Number(time),
                    "average": Number((calculate_sum(statsByTime, stats[1])/statsByTime.length).toFixed(2)),
                    "frequency": statsByTime.length,
                };
                graphData.cols[index].stats.push(statsByTimeObject);
            }
        });
    }
    
}

function calculatePoint(i, intervalSize, colorRangeInfo) {
    var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return (useEndAsStart
      ? (colorEnd - (i * intervalSize))
      : (colorStart + (i * intervalSize)));
}

/* Must use an interpolated color scale, which has a range of [0, 1] */
function interpolateColors(dataLength, colorRangeInfo) {
    var { colorStart, colorEnd } = colorRangeInfo;
    var colorRange = colorEnd - colorStart;
    var intervalSize = colorRange / dataLength;
    var i, colorPoint;
    var colorArray = [];
  
    for (i = 0; i < dataLength; i++) {
      colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
      colorArray.push(d3.interpolateInferno(colorPoint));
    }
  
    return colorArray;
}  

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }


// area ratio
// function computeRadius(val, oldRad, angle){
//     //val is new value need to be add in to 
//     //oldRad is the previous circle's radius

//     // then compute the area of the inner slice
//     var innerA = angle*Math.PI*oldRad^2;
//     var outerA = innerA + val;
//     //innerA/outerA = innerR^2/outerR^2;
//     //Math.SQRT(innerA/outerA) = innerR/outerR
//     //outerR=innerR/Math.SQRT(innerA/outerA)
//     var r = oldRad/Math.sqrt(innerA/outerA);
//     return r;
// }

//radius ratio
function computeRadius(val, oldRad, angle){

    // then compute the area of the inner slice
    // var innerA = angle*Math.PI*oldRad^2;
    // var outerA = innerA + val;
    // //innerA/outerA = innerR^2/outerR^2;
    // //Math.SQRT(innerA/outerA) = innerR/outerR
    // //outerR=innerR/Math.SQRT(innerA/outerA)
    // var r = oldRad/Math.sqrt(innerA/outerA);
    return val + oldRad;
}

function shallow_copy(item){
    return JSON.parse(JSON.stringify(item));
}

function get_curr_radius(labels, time, labelName){
    var new_radius = []
    for(var i=0; i<labels.length; i++){
        for(var j=0; j<graphData.cols.length; j++){
            if(graphData.cols[j].title == labels[i] && typeof graphData.cols[j].stats[time] != "undefined"){
                new_radius.push(graphData.cols[j].stats[time][labelName]);
            }else if(graphData.cols[j].title == labels[i] && typeof graphData.cols[j].stats[time] == "undefined"){
                new_radius.push(0);
            }
        }
    }
    return new_radius;
}

// 
function generate_current_data(radius, length, labels, sumA, timeList, currTime){
    var data = [];
    for(var i=0; i<length; i++){
        var newRs = get_curr_radius(labels, i, "average");
        var currData=[];
        for(var j=0; j<radius.length; j++){
            var index = labels.indexOf(radius[j]["label"]);
            if(index != -1){
                //currData.push(radius[index]);
                if(i==0){
                    radius[index].inner = 0;
                    radius[index].outer = radius[index].radius;
                    radius[index].time = get_time(radius[j]["label"], radius[index].radius);
                    // console.log(radius[index].time);
                    if(radius[index].time == currTime){
                        radius[index].opacity = 1;
                    }else{
                        radius[index].opacity = 0.7;
                    }
                    // delete radius[index].radius;
                    currData.push(shallow_copy(radius[index]));
                }else{
                    var oldRadius = shallow_copy(data[i-1][j].outer);
                    //compute the radius]
                    var angle = radius[index].value/sumA;
                    radius[index].inner = oldRadius;
                    var newRadius = newRs[index];
                    radius[index].outer = computeRadius(newRadius, oldRadius, angle);
                    radius[index].radius = newRadius;
                    radius[index].time = get_time(radius[j]["label"], radius[index].radius);
                    // console.log(radius[index].time);
                    if(radius[index].time == currTime){
                        radius[index].opacity = 1;
                    }else{
                        radius[index].opacity = 0.7;
                    }
                    // delete radius[index].rdius;
                    currData.push(shallow_copy(radius[index]));
                }
            }
        }
        // console.log(currData);
        data.push(currData);
    }
    return data;
}

function reScale(data, width){
    //rescale the graph to max of 200 for d3 to visualize
    //go to the last interval's index
    var max = 0;
    for(var i=0; i<data[data.length-1].length; i++){
        if (max < data[data.length-1][i].outer){
            max = data[data.length-1][i].outer;
        }
    }
    return max/width*2;
}

function get_time(label, radius){
    for(var i=0; i<graphData.cols.length; i++){
        if(graphData.cols[i]["title"] == label){
            for(var j=0; j<graphData.cols[i].stats.length; j++){
                if(graphData.cols[i].stats[j].average == radius){
                    return graphData.cols[i].stats[j]["time"];
                }
            }
        }
        
    }
}

var config = 
{  
    "dataSpacing": 2,
    "setData": function (time)
    {   
        var width = d3.select('.pieChart').node().getBoundingClientRect().width;
        var height = width;
        document.querySelectorAll('.pieChartSvg').forEach(pie => {
            pie.remove();
        });
        var eElement = document.getElementById('1');
        var newSvg = document.createElement("svg");
        newSvg.setAttribute("class","pieChartSvg");  
        eElement.insertBefore(newSvg, eElement.firstChild);

        var dataSet = 
        {   
            "labelList": [],
            "labels": [],
            "stats": [],
            "radius": []
        };
        var filteredtime = [];
        var combinedStats = [];

        for (var i = 0; i < graphData.cols.length; i++)
        {
            var filtered = graphData.cols[i].stats.filter(function(x) { return x.time == time;})
            // console.log(filtered);
            if (filtered.length > 0)
            {
                if (filtered[0].frequency > 0)
                {   
                    dataSet.labelList.push(graphData.cols[i].title);
                    dataSet.labels.push({title: graphData.cols[i].title, color: graphData.cols[i].color});
                    dataSet.stats.push({label: graphData.cols[i].title, value: filtered[0].frequency, radius: 0, color: graphData.cols[i].color});
                    dataSet.radius.push({label: graphData.cols[i].title, value: filtered[0].frequency, radius: graphData.cols[i].stats[0].average, color: graphData.cols[i].color}); 	
                }
            }

            var unfiltered = graphData.cols[i].stats
            // .filter(function(x) { return x.time != time;})
            // console.log(unfiltered);
            for (var j = 0; j < unfiltered.length; j++)
            {
                filteredtime.push({label: graphData.cols[i].title, time: unfiltered[j].time, radius: unfiltered[j].average});
            }
            
        }

        // console.log(filteredtime);

        //generate list of data corresponding the different times
        for (var i = 0; i < graphData.rows.length; i++)
        {   
            var currtime = graphData.rows[i];
            // if(currtime == time){
            //     continue;
            // }
            
            var currStats = {
                time: currtime, 
                data: []
            }
            currStats.data = shallow_copy(dataSet.stats);
            //filter the set with time = currtime
            var currtimeSet = []

            for(var j = 0; j < filteredtime.length; j++){
                if(filteredtime[j]["time"] == currtime){
                    currtimeSet.push(filteredtime[j]);
                }
            }
            // console.log(currStats.data);
            for(var k = 0; k < currStats.data.length; k++){
                for(var j = 0; j < currtimeSet.length; j++){
                    if(currStats.data[k]["label"] == currtimeSet[j]["label"]){
                        currStats.data[k]["radius"] = currtimeSet[j]["radius"]
                    }
                }
            }
            // console.log(currStats);
            combinedStats.push(currStats);
        }

        // console.log(combinedStats);
        // console.log(dataSet);


        //Plot the pie chart
        var svg =  d3.select('.pieChart')
        .append('svg')
        .attr('class','pieChartSvg')
        .attr('width',width)
        .attr('height',height)
        var legend = d3.select(".pieLegendSvg");
        

        legend
        .html("")
        .style("height", function(d) {
            return ((config.dataSpacing * dataSet.labels.length) + 2) + "em";
        }); 

        var pie = 
        d3.pie()
        .sort(null)
        .value(function(d) 
        {
            return d.value; 
        });

        var radius = dataSet.radius;

        console.log(radius);

        var sumA = 0;
        for(var i=0; i<dataSet.radius.length; i++){
            sumA += dataSet.radius[i].value;
        }
        var labels = dataSet.labelList;
        var data = generate_current_data(radius, graphData.rows.length, labels, sumA, graphData.rows, time);
        console.log(data);
        var scale = reScale(data, width);
        console.log(scale);

        var arc = d3.arc()
        .innerRadius(function (d){
            return d.data.inner/scale;
        })
        .outerRadius(function (d) { 
            return d.data.outer/scale;
        });
        
        
        var pie = d3.pie()
        .sort(null)
        .value(function(d) { 
            return d.value; 
        });

        for(var i=0; i<combinedStats.length; i++){

            svg.selectAll('arc')
            .data(pie(data[i]))
            .enter()
            .append('path')
            .attr('stroke','white')
            .attr("stroke-width", 0.1)
            .attr('d',arc)
            .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')')
            .attr("fill", function(d) {
                return d.data.color;
            })
            .style("opacity", function(d) {
                return d.data.opacity;
            })
            .on("click", function(event, d) {
                console.log(d.data);
                config.setData(d.data.time);
                event.stopPropagation();
            })
            .on("mouseover", function (event, d) {
                d3.select("#tooltip")
                .style("left", event.pageX-width/4 + "px")
                .style("top", event.pageY-width/4 + "px")
                .style("opacity", 1)
                .select("#value")
                .text(function(){
                    //tooltip should include 
                    //percentage of catagory of the current time (number), 
                    //curr time, 
                    //value of that time (price)
                    return "Percentage: " + (d.value/sumA).toFixed(2)*100 + "% (" + d.value + ")"
                            + "time: " + d.data.time
                            + "Value: " + d.data.radius;
                });
            })
            .on("mouseout", function () {
            // Hide the tooltip
                d3.select("#tooltip")
                .style("opacity", 0);
            });

            
        }
        
        legend
        .selectAll("rect")
        .data(dataSet.labels)
        .enter()
        .append("rect")
        .attr("x", function(d) 
        {
            return config.dataSpacing + "em";
        })
        .attr("y", function(d, i) 
        {
            return ((config.dataSpacing * i) + 1)  + "em";
        })
        .attr("fill", function(d) 
        {
            return d.color;
        })
        .attr("width", function(d) 
        {
            return (config.dataSpacing / 2) + "em";
        })
        .attr("height", function(d) 
        {
            return (config.dataSpacing / 2) + "em";
        });

        legend
        .selectAll("text")
        .data(dataSet.labels)
        .enter()
        .append("text")
        .attr("x", function(d) 
        {
            return (config.dataSpacing * 2) + "em";
        })
        .attr("y", function(d, i) 
        {
            return ((config.dataSpacing * i) + 2)  + "em";
        })
        .text(function(d) 
        {
            return d.title;
        });
    }
};