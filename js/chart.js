var graphData = {}; 
var data = [];
var combinedStats = [];
var dataSet = 
{   
    "labelList": [],
    "labels": [],
    "stats": [],
    "radius": []
};
var piedata = [];
var firstTimeOrder = [];
var alignMode = false;

const colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
}; 


function read_data(data){
    graphData.cols = [];
    graphData.rows = get_rows(data);
    graphData.stats = get_stats(data);
    var catagories = get_titles(data);
    console.log(catagories);
    var COLORS = interpolateColors(catagories.length, colorRangeInfo);
    //console.log(COLORS);
    catagories.forEach((cat) => {
        graphData.cols.push({"title": cat});
    });
    for(var i =0; i<catagories.length; i++){
        count_freq(data, catagories[i], i, COLORS);
    }
    console.log(graphData);
    graphData.rows.forEach(row => {
        config.setData(row);
    })
    //sort graphData by time
    sortData();
    config.setData(graphData.rows[0]);
    config.plotPie();
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
    var filtered = data.filter(function(x) { 
        return x[stats[2]] == title;
    })
    if (filtered.length > 0){
        graphData.rows.forEach((time) => {
            var statsByTime = filtered.filter(function(x) { return x[stats[0]] == time});
            if(statsByTime.length > 0){
                var statsByTimeObject = {
                    "time": time,
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

function shallow_copy(item){
    if(item != undefined){
        return JSON.parse(JSON.stringify(item));
    }
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

function sortData(){
    for(var i=0; i<graphData.cols.length; i++){
        graphData.cols[i].stats.sort((a, b) => (a.time > b.time) ? 1 : -1)
    }
}

function update_graphData(radius, timeList, currTime){
    prevTime = timeList.slice(0, timeList.indexOf(currTime));
    prevTime = prevTime.sort();
    for(var i=0; i<graphData.cols.length; i++){
        prevTime.forEach((time) => {
            const unique = Array.from(new Set(graphData.cols[i].stats.map(item => item.time)));
            if(unique.indexOf(time) == -1){
                //insert new data of the year
                var dummy = {};
                dummy.time = time;
                
                dummy.frequency = 0;
                graphData.cols[i].stats.unshift(dummy);
            }
        });
    }
    //update the average if the frequency is 0
    //sort the values of radius
    for(var i=0; i<graphData.cols.length; i++){
        var filtered = graphData.cols[i].stats.filter(function(x) { return x.frequency == 0;})
        filtered.forEach((dummy) => {
            var dummyData = shallow_copy(radius)
            dummyData.sort((a,b)=> {
                if (a.value == b.value){
                    return a.radius > b.radius ? -1 : 1
                } else {
                    return a.value > b.value ? 1 : -1
                }
            });
            console.log(dummyData);
            //find the title 
            var currTitle = graphData.cols[i].title;
            var index = dummyData.findIndex(function(o) {
                return o.label == currTitle;
            });
            if(dummy.time > currTime){
                //console.log(getAvg(i));
                dummy.average = find_inner(radius); 
            }else
            if(index == 0){
                //the next one
                dummy.average = dummyData[index+1].radius;
            }else if(index != -1){
                //console.log(dummyData, index);
                dummy.average = dummyData[index-1].radius;
            }else{
                dummy.average = 1;
            }
        });
            
        
    }
}

function find_inner(radius){
    var sumR = 0;
    radius.forEach(r => {
        sumR += r.radius;
    });
    return sumR/radius.length;
}

// 
function generate_current_data(radius, length, labels, timeList, currTime){ 
    update_graphData(radius, timeList, currTime)

    data = [];
    for(var i=0; i<length; i++){
        var newRs = get_curr_radius(labels, i, "average");
        var currData=[];
        for(var j=0; j<radius.length; j++){
            var index = labels.indexOf(radius[j]["label"]);
            if(index != -1){
                if(i==0){
                    //compute the default inner circle
                    radius[index].inner = find_inner(radius);
                    radius[index].outer = radius[index].inner + radius[index].radius;
                    var time = get_time(radius[j]["label"], radius[index].radius)
                    radius[index].time = time;
                    if(check_dummy(radius[j]["label"], time)){
                        radius[index].dummy = true;
                    }else{
                        radius[index].dummy = false;
                    }
                    // console.log(radius[index].time);
                    if(radius[index].time == currTime){
                        radius[index].selected = true;
                    }else{
                        radius[index].selected = false;
                    }
                    // delete radius[index].radius;
                    currData.push(shallow_copy(radius[index]));
                }else{
                    var oldRadius = shallow_copy(data[i-1][j].outer);
                    //compute the radius]
                    radius[index].inner = oldRadius;
                    var newRadius = newRs[index];
                    radius[index].outer = newRadius + oldRadius;
                    radius[index].radius = newRadius;
                    var time = get_time(radius[j]["label"], radius[index].radius)
                    radius[index].time = time;
                    if(check_dummy(radius[j]["label"], time)){
                        radius[index].dummy = true;
                    }else{
                        radius[index].dummy = false;
                    }
                    // console.log(radius[index].time);
                    if(radius[index].time == currTime){
                        radius[index].selected = true;
                    }else{
                        radius[index].selected = false;
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

function check_dummy(label, time){
    var dummies = [];
    var isDum = false;
    for(var i=0; i<graphData.cols.length; i++){
        graphData.cols[i].stats.forEach(stat => {
            if(stat != undefined && stat.frequency == 0){
                dummies.push({
                    'stat':stat, 
                    'label':graphData.cols[i].title
                });
            }
        })
    }
    //console.log(dummies);
    dummies.forEach(dummy => {
        if(dummy.stat.time == time && dummy.label == label){
            isDum = true;
            return;
        }
    });
    return isDum;
}

function flat_data(target){
    var length = target.length;
    //for every length of piedata
    for(var i=0; i<length; i++){
        for(var j=i; j<piedata.length; j+=length){
            piedata[j].startAngle = target[i].startAngle;
            piedata[j].endAngle = target[i].endAngle;
            
        }
    }
}

function reScale(width){
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

        dataSet = 
        {   
            "labelList": [],
            "labels": [],
            "stats": [],
            "radius": []
        };
        var filteredtime = [];
        combinedStats = [];

        for (var i = 0; i < graphData.cols.length; i++)
        {
            var filtered = graphData.cols[i].stats.filter(function(x) { return x.time == time;})
            // console.log(filtered);
            if (filtered.length > 0)
            {
                if (filtered[0].frequency > 0)
                {   
                    dataSet.labelList.push({label: graphData.cols[i].title, value: filtered[0].frequency});
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

        var radius = dataSet.radius;
        if(time == graphData.rows[0]){
            radius.sort((a, b) => (a.value > b.value) ? 1 : -1)
            dataSet.labelList.sort((a, b) => (a.value > b.value) ? 1 : -1)
            firstTimeOrder = dataSet.labelList.map(function(d) { return d["label"]; });
        }else{
            console.log(firstTimeOrder);
            radius.sort(function(a, b){  
                return firstTimeOrder.indexOf(a.label) - firstTimeOrder.indexOf(b.label);
            });
            dataSet.labelList.sort(function(a, b){  
                return firstTimeOrder.indexOf(a.label) - firstTimeOrder.indexOf(b.label);
            });
        }

        var labels = dataSet.labelList.map(function(d) { return d["label"]; });

        console.log(radius, labels);
        data = generate_current_data(radius, graphData.rows.length, labels, graphData.rows, time);
        console.log(data);


    },
    "updateData": function ()
    {   
        var pie = d3.pie()
        .value(function(d) { 
            return d.value; 
        })
        .sort(null);
        
        var target = pie(data[0]);
        data = [].concat(...data);
        piedata = pie(data);
        flat_data(target);
    },
    "compare": function (time)
    {
        console.log("compare " + time);
        //find the data of the given time
        var compareSet = {
            "labels": [],
            "stats": []
        }
        for (var i = 0; i < graphData.cols.length; i++)
        {
            var filtered = graphData.cols[i].stats.filter(function(x) { return x.time == time;})
            // console.log(filtered);
            if (filtered.length > 0)
            {
                if (filtered[0].frequency > 0)
                {   
                    compareSet.labels.push({title: graphData.cols[i].title, color: graphData.cols[i].color});
                    compareSet.stats.push({label: graphData.cols[i].title, value: filtered[0].frequency, color: graphData.cols[i].color});
                }
            } 
        }

        var width = 600;
        var height = width;

        var chart = d3.select(".pieChartSvgCompare");
        var legend = d3.select(".pieLegendSvgCompare");

        chart = d3.select(".pieChartSvgCompare")
        .attr('width',width)
        .attr('height',height)

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


        var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2);

        console.log(compareSet.stats);

        
        chart.selectAll('.arcCompare')
        .data(pie(compareSet.stats))
        .enter()
        .append('path')
        .classed('arcCompare',true)
        .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')')
        .attr('d',arc)
        .style('fill', function(d) {
            return d.data.color;
        })

        


        legend
        .selectAll("rect")
        .data(compareSet.labels)
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
        .data(compareSet.labels)
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

    },
    "align": function (piedata, time)
    {
        //adjust the inner and outer radius for all the pie data

        //find the largest value to align
        var filteredData = piedata.filter(d => {
            return d.data.time == time;
        });
        var max = Math.max(...filteredData.map(d => d.data.inner))
        var diffArr = [];
        piedata.forEach(d => {
            if(d.data.time == time){
                diffArr.push({"title": d.data.label, "diff": max-d.data.inner});
            }
        });

        //update other data correspondingly
        piedata.forEach(d => {
            diffArr.forEach(a => {
                if(a.title == d.data.label){
                    d.data.inner += a.diff;
                    d.data.outer += a.diff;
                }
            });
        });
        return piedata;

    },
    "plotPie": function ()
    {   
        var width = d3.select('.pieChart').node().getBoundingClientRect().width;
        var height = width;

        var sumA = 0;
        for(var i=0; i<dataSet.radius.length; i++){
            sumA += dataSet.radius[i].value;
        }

        var scale = reScale(width);
        console.log(scale);

        //Plot the pie chart
        var svg =  d3.select('.pieChartSvg')
        .attr('width',width)
        .attr('height',height)

        var legend = d3.select(".pieLegendSvg");
        
        legend
        .html("")
        .style("height", function(d) {
            return ((config.dataSpacing * dataSet.labels.length) + 2) + "em";
        }); 

        var arc = d3.arc()
        .innerRadius(function (d){
            return d.data.inner/scale;
        })
        .outerRadius(function (d) { 
            return d.data.outer/scale;
        });

        var emptyArc = d3.arc()
        .innerRadius(0)
        .outerRadius(0);
        
        
        var pie = d3.pie()
        .value(function(d) { 
            return d.value; 
        })
        .sort(null);

        var target = pie(data[0]);
        data = [].concat(...data);
        piedata = pie(data);
        flat_data(target);


        function updateChart() {
            //https://stackoverflow.com/questions/59356095/error-when-transitioning-an-arc-path-attribute-d-expected-arc-flag-0-or
            console.log('pie data is ', piedata)

            var local = d3.local();
            console.log(' pieData', piedata)


            let arcs = svg.selectAll('.arcWedge')
            .data(piedata,d=>d.data.label + '_' + d.data.time)
            .join(enter=>  {
                console.log(' enter selection' , enter.size());
                    return enter
                    .append('path')
                    .classed('arcWedge',true)
                    .each(function(d) {
                        local.set(this, d)
                    })
                    .attr('transform', 'translate(' + width/2 +  ',' + height/2 +')')},

                update=>{ console.log(' update selection' , update.size()); return update},

                exit=>exit
                    .transition()
                    .duration(100)
                    .attr('d',emptyArc)
                    .on('end', function() {
                        d3.select(this).remove();
                    })
                );

            arcs.each(function(d, i) {
                if(d.data.selected){
                    d3.select(this).classed('selected',true)
                }else{
                    d3.select(this).classed('selected',false)
                }
            })
            .transition()
            .duration(1000)
            .attrTween('d', function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    _this._current = interpolate(t);
                    return arc(_this._current);
                };
            })
            // .attr('d',arc)
            .attr('stroke',function(d){
                if(d.data.dummy){
                    return 'black'
                }else{
                    return 'white'
                }
                })
            .attr("stroke-width", 0.5)
            .style("stroke-dasharray", function(d){
                if(d.data.dummy){
                    return ("1,3")
                }
            })
            
            .style('fill', function(d) {
                if(d.data.dummy){
                    return 'url(#diagonal-stripe-3)'; //why not working
                }else{
                    return d.data.color;
                }
            })
            
            arcs.on("click", function(event, d) {
                alignMode = false;
                console.log(d.data);
                config.setData(d.data.time);
                config.setData(d.data.time);
                config.plotPie();
                //event.stopPropagation();
                //updateChart();
            })
            .on("mouseover", function (event, d) {
                d3.select(this)
                .style("stroke", "black")
                .attr("stroke-width", 4)
                d3.select("#tooltip")
                .style("left", event.pageX-width/4 + "px")
                .style("top", event.pageY-width/4 + "px")
                .style("opacity", 1)
                .select("#value")
                d3.select("#tooltip").html("Title: " + (d.data.label) + "<br/>" + "Percentage: " + (d.value/sumA).toFixed(2)*100 + "% (" + d.value + ")"
                            + "<br/>" + "time: " + d.data.time
                            + "<br/>" + "Value: " + d.data.radius)
            })
            .on("mouseout", function () {
            // Hide the tooltip
                d3.select(this)
                .style("stroke", "white")
                .attr("stroke-width", 0.5)
                d3.select("#tooltip")
                .style("opacity", 0);
            })
            .on("contextmenu", function (event, d) {
                event.preventDefault();
                if(d.data.selected){
                    d3.select('.custom-menu')
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px")
                    .style("opacity", 1);
                }
                //check if compare is clicked
                d3.select('#compare')
                .on("click", function(){
                    d3.select('.custom-menu')
                    .style("opacity", 0);
                    d3.select("#tooltip")
                    .style("opacity", 0);
                    config.compare(d.data.time);
                })
                d3.select('#align')
                .on("click", function(){
                    d3.select('.custom-menu')
                    .style("opacity", 0);
                    d3.select("#tooltip")
                    .style("opacity", 0);
                    alignMode = !alignMode;
                    if(alignMode == true){
                        d3.select('#align').html("back");
                        config.align(piedata, d.data.time);
                        updateChart();
                    }else{
                        d3.select('#align').html("align");
                        config.setData(d.data.time);
                        config.setData(d.data.time);
                        config.plotPie();
                    }

                })
                d3.select("#tooltip")
                .style("opacity", 0);
            })
            
          }
          
          updateChart();

          d3.select('.pieChart')
          .on("click", function (event, d){
            d3.select('.custom-menu')
            .style("opacity", 0);
          });

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
            if(!isNaN(d.title)){
                return d.title + " " + cat_title;
            }
            return d.title;
        });
    }
};