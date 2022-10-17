// Note: for animation and fancy styling, https://www.amcharts.com/demos/variable-radius-pie-chart/ is an library to enhance the visualization for pie chart that I found, but not sure if I can use it


//1. wedges are stacks sequancially in time
//2. think about the math to implement the area of each slice (from outer to inner if overlap)
//3. tooltip should include percentage of catagory of the current year (number), curr year, value of that year (price)
//4. if click on the wedge of a year, change to that year's chart


function read_csv(){

}

// count the frequency of the catogorical variables
function count_freq(){

}

// generate/randomize color and assign them to each of the catogorical variables
function generate_color(){

}

//
function computeRadius(val, oldRad, angle){
    //val is new value need to be add in to 
    //oldRad is the previous circle's radius

    // then compute the area of the inner slice
    var innerA = angle*Math.PI*oldRad^2;
    var outerA = innerA + val;
    //innerA/outerA = innerR^2/outerR^2;
    //Math.SQRT(innerA/outerA) = innerR/outerR
    //outerR=innerR/Math.SQRT(innerA/outerA)
    var r = oldRad/Math.sqrt(innerA/outerA);
    return r;
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
    console.log(timeList);
    var data = [];
    for(var i=0; i<length; i++){
        var newRs = get_curr_radius(labels, i, "price");
        var currData=[];
        for(var j=0; j<radius.length; j++){
            var index = labels.indexOf(radius[j]["label"]);
            if(index != -1){
                //currData.push(radius[index]);
                if(i==0){
                    radius[index].inner = 0;
                    radius[index].outer = radius[index].radius;
                    radius[index].time = get_time(radius[j]["label"], radius[index].radius);
                    console.log(radius[index].time);
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
                    console.log(radius[index].time);
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
        console.log(currData);
        data.push(currData);
    }
    return data;
}

function reScale(data){
    //rescale the graph to max of 200 for d3 to visualize
    //go to the last interval's index
    var max = 0;
    for(var i=0; i<data[data.length-1].length; i++){
        if (max < data[data.length-1][i].outer){
            max = data[data.length-1][i].outer;
        }
    }
    return max/200;
}

function get_time(label, radius){
    for(var i=0; i<graphData.cols.length; i++){
        if(graphData.cols[i]["title"] == label){
            for(var j=0; j<graphData.cols[i].stats.length; j++){
                if(graphData.cols[i].stats[j]["price"] == radius){
                    return graphData.cols[i].stats[j]["year"];
                }
            }
        }
        
    }
}

//summarize the data the return the below format
function summarize_data(){

    var summary = [
        [
            {label: '1 Bedroom', time: 2007, radius: 77.85714285714286, color: "rgb(100, 50, 0)"},
            {label: '1 Bedroom', time: 2008, radius: 90.47619047619048, color: "rgb(100, 50, 0)"},
        ],
        [
            {label: '2 Bedrooms', time: 2008, radius: 86.48809523809524, color: "rgb(255, 0, 0)"},
            {label: '2 Bedrooms', time: 2010, radius: 88.69047619047619, color: "rgb(255, 0, 0)"},
            {label: '2 Bedrooms', time: 2009, radius: 100, color: "rgb(255, 0, 0)"}
        ],
        [
            {label: '3 Bedrooms', time: 2007, inner: 0, outer: 80.21164285714286, color: "rgb(0, 50, 50)"},
            {label: '3 Bedrooms', time: 2008, inner: 80.21164285714286, outer: 92.83333333333333, color: "rgb(0, 50, 50)"},
            {label: '3 Bedrooms', time: 2009, inner: 92.83333333333333, outer: 93.44047619047619, color: "rgb(0, 50, 50)"},
            {label: '3 Bedrooms', time: 2010, inner: 93.44047619047619, outer: 101.9672619047619, color: "rgb(0, 50, 50)"},
            {label: '3 Bedrooms', time: 2011, inner: 101.9672619047619, outer: 108.42771428571429, color: "rgb(0, 50, 50)"},
            {label: '3 Bedrooms', time: 2012, inner: 108.42771428571429, outer: 109.514, color: "rgb(0, 50, 50)"}
        ],
        [               
            {label: '4 Bedrooms', time: 2011, inner: 0, outer: 127.11309523809524, color: "rgb(255, 100, 0)"},
            {label: '4 Bedrooms', time: 2009, inner: 127.11309523809524, outer: 128.12352380952382, color: "rgb(255, 100, 0)"},
            {label: '4 Bedrooms', time: 2010, inner: 137.63392857142858, outer: 137.63392857142858, color: "rgb(255, 100, 0)"},
            {label: '4 Bedrooms', time: 2008, inner: 141.60257142857145, outer: 141.60257142857145, color: "rgb(255, 100, 0)"},
            {label: '4 Bedrooms', time: 2012, inner: 151.86147619047617, outer: 151.86147619047617, color: "rgb(255, 100, 0)"},
            {label: '4 Bedrooms', time: 2007, inner: 176.54761904761904, outer: 176.54761904761904, color: "rgb(255, 100, 0)"}
        ],
        [
            {label: '5 Bedrooms', time: 2011, inner: 0, outer: 133.33333333333334, color: "rgb(0, 0, 0)"},
            {label: '5 Bedrooms', time: 2008, inner: 133.33333333333334, outer: 145.23809523809524, color: "rgb(0, 0, 0)"},
            {label: '5 Bedrooms', time: 2009, inner: 145.23809523809524, outer: 178.57142857142858, color: "rgb(0, 0, 0)"},
            {label: '5 Bedrooms', time: 2007, inner: 178.57142857142858, outer: 190.47619047619048, color: "rgb(0, 0, 0)"},
            {label: '5 Bedrooms', time: 2010, inner: 190.47619047619048, outer: 194.36507142857144, color: "rgb(0, 0, 0)"},
            {label: '5 Bedrooms', time: 2012, inner: 194.36507142857144, outer: 241.66666666666666, color: "rgb(0, 0, 0)"}
        ],
    ]

    return summary
}

// just a hard coded summary of some dummy data from sample_data.csv
var graphData = 
{
    "cols":
    [
        {
            "title": "1 Bedroom",
            "color": "rgb(100, 50, 0)",
            "stats": 
            [
                {"year": 2007, "price": 327000, "frequency": 1},
                {"year": 2008, "price": 380000, "frequency": 1}
            ]
        },
        {
            "title": "2 Bedrooms",
            "color": "rgb(255, 0, 0)",
            "stats": 
            [
                {"year": 2008, "price": 363250, "frequency": 2},
                {"year": 2009, "price": 420000, "frequency": 1},
                {"year": 2010, "price": 372500, "frequency": 1}
            ]
        },
        {
            "title": "3 Bedrooms",
            "color": "rgb(0, 50, 50)",
            "stats": 
            [
                {"year": 2007, "price": 336888.9, "frequency": 9},
                {"year": 2008, "price": 389900, "frequency": 10},
                {"year": 2009, "price": 392450, "frequency": 10},
                {"year": 2010, "price": 428262.5, "frequency": 8},
                {"year": 2011, "price": 455396.4, "frequency": 14},
                {"year": 2012, "price": 459958.8, "frequency": 17}
            ]
        },
        {
            "title": "4 Bedrooms",
            "color": "rgb(255, 100, 0)",
            "stats": 
            [
                {"year": 2007, "price": 741500, "frequency": 8},
                {"year": 2008, "price": 594730.8, "frequency": 13},
                {"year": 2009, "price": 538118.8, "frequency": 8},
                {"year": 2010, "price": 578062.5, "frequency": 8},
                {"year": 2011, "price": 533875, "frequency": 12},
                {"year": 2012, "price": 637818.2, "frequency": 11}
            ]
        },
        {
            "title": "5 Bedrooms",
            "color": "rgb(0, 0, 0)",
            "stats": 
            [
                {"year": 2007, "price": 800000, "frequency": 1},
                {"year": 2008, "price": 610000, "frequency": 1},
                {"year": 2009, "price": 750000, "frequency": 1},
                {"year": 2010, "price": 816333.3, "frequency": 3},
                {"year": 2011, "price": 560000, "frequency": 1},
                {"year": 2012, "price": 1015000, "frequency": 1}
            ]
        }
    ],
    "rows": [2007, 2008, 2009, 2010, 2011, 2012],
    "stats": ["price", "frequency"]
}; 


    // var color = d3.scaleOrdinal(d3.schemeCategory20c);
    // color.domain(participants);

var config = 
{  
    "dataSpacing": 2,
    "setData": function ()
    {   
        var width = d3.select('.pieChartSvg').node().getBoundingClientRect().width*2;
        var height = width;
        document.querySelectorAll('.pieChartSvg').forEach(pie => {
            pie.removeChild(pie.lastChild);
        });

        var year = d3.select("#ddlYear").node().value;

        var dataSet = 
        {   
            "labelList": [],
            "labels": [],
            "stats": [],
            "radius": []
        };
        var filteredYear = [];
        var combinedStats = [];

        for (var i = 0; i < graphData.cols.length; i++)
        {
            var filtered = graphData.cols[i].stats.filter(function(x) { return x.year == year;})
            console.log(filtered);
            if (filtered.length > 0)
            {
                if (filtered[0]["frequency"] > 0)
                {   
                    dataSet.labelList.push(graphData.cols[i].title);
                    dataSet.labels.push({title: graphData.cols[i].title, color: graphData.cols[i].color});
                    dataSet.stats.push({label: graphData.cols[i].title, value: filtered[0]["frequency"], radius: 0, color: graphData.cols[i].color});
                    dataSet.radius.push({label: graphData.cols[i].title, value: filtered[0]["frequency"], radius: graphData.cols[i].stats[0]["price"], color: graphData.cols[i].color}); 	
                }
            }

            var unfiltered = graphData.cols[i].stats
            // .filter(function(x) { return x.year != year;})
            console.log(unfiltered);
            for (var j = 0; j < unfiltered.length; j++)
            {
                filteredYear.push({label: graphData.cols[i].title, time: unfiltered[j]["year"], radius: unfiltered[j]["price"]});
            }
            
        }

        console.log(filteredYear);

        //generate list of data corresponding the different years
        for (var i = 0; i < graphData.rows.length; i++)
        {   
            var currYear = graphData.rows[i];
            // if(currYear == year){
            //     continue;
            // }
            
            var currStats = {
                time: currYear, 
                data: []
            }
            currStats.data = shallow_copy(dataSet.stats);
            //filter the set with year = currYear
            var currYearSet = []

            for(var j = 0; j < filteredYear.length; j++){
                if(filteredYear[j]["time"] == currYear){
                    currYearSet.push(filteredYear[j]);
                }
            }
            console.log(currStats.data);
            for(var k = 0; k < currStats.data.length; k++){
                for(var j = 0; j < currYearSet.length; j++){
                    if(currStats.data[k]["label"] == currYearSet[j]["label"]){
                        currStats.data[k]["radius"] = currYearSet[j]["radius"]
                    }
                }
            }
            console.log(currStats);
            combinedStats.push(currStats);
        }

        console.log(combinedStats);
        console.log(dataSet);


        



        //Plot the pie chart
        var container = d3.select(".pieChartContaine");
        var wrapper = d3.select(".pieChart");
        var legend = d3.select(".pieLegendSvg");

        container
        .style("width", function(d) 
        {
            return ((config.dataSpacing + config.dataWidth) * 2) + "em";
        });

        wrapper
        .style("height", function(d) 
        {
            var legendHeight = (config.dataSpacing * dataSet.labels.length) + 2;
            var chartHeight = (config.dataSpacing + config.dataWidth);

            return (chartHeight > legendHeight ? chartHeight : legendHeight) + "em";
        }); 
        

        legend
        .html("")
        .style("height", function(d) {
            return ((config.dataSpacing * dataSet.labels.length) + 2) + "em";
        }); 

        var pie = 
        d3.layout.pie()
        .sort(null)
        .value(function(d) 
        {
            return d.value; 
        });

        var radius = dataSet.radius;

        console.log(radius);
        var summary = summarize_data();
        console.log(summary);
        var sumA = 0;
        for(var i=0; i<dataSet.radius.length; i++){
            sumA += dataSet.radius[i].value;
        }
        var labels = dataSet.labelList;
        var data = generate_current_data(radius, graphData.rows.length, labels, sumA, graphData.rows, year);
        console.log(data);
        var scale = reScale(data);
        console.log(scale);

        var arc = d3.svg.arc()
        .innerRadius(function (d){
            return d.data.inner/scale;
        })
        .outerRadius(function (d) { 
            return d.data.outer/scale;
        });
        
        
        var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { 
            return d.value; 
        });
            
        var svg =  d3.select('.pieChartSvg').append('svg').attr('width',width).attr('height',height)

        for(var i=0; i<combinedStats.length; i++){
            svg.selectAll("arc")
            .data(pie(data[i]))
            .enter()
            .append('path')
            .attr('d',arc)
            .attr('transform','translate(250,250)')
            .attr("fill", function(d) {
                return d.data.color;
            })
            .attr('stroke','white')
            .attr("stroke-width", 0.1)
            .style("opacity", function(d) {
                return d.data.opacity;
            })
            .on("mouseover", function (d) {
                d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1)
                .select("#value")
                .text(function(){
                    //tooltip should include 
                    //percentage of catagory of the current year (number), 
                    //curr year, 
                    //value of that year (price)
                    return "Percentage: " + (d.value/sumA).toFixed(2)*100 + "% (" + d.value + ")"
                            + "Year: " + d.data.time
                            + "Value: " + d.data.radius;
                });
            })
            .on("mouseout", function () {
            // Hide the tooltip
                d3.select("#tooltip")
                .style("opacity", 0);;
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

var ddlYear = d3.select("#ddlYear");

ddlYear.selectAll("option")
.data(graphData.rows)
.enter()
.append("option")
.property("selected", function(d, i) 
{
    return i == 0;

})
.attr("value", function(d) 
{
    return d;
})
.text(function(d) 
{
    return d;
});


config.setData();

d3.select("#ddlYear").on("change", function() { config.setData(); });