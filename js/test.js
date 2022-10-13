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
function generate_current_data(radius, summary, length){
    var currLabelList=[];
    //generate label list
    for(var i=0; i<radius.length; i++){
        currLabelList.push(radius[i]["label"]);
    }

    var dataList = [];
    for(var i=0; i<length; i++){
        var currStats=[];
        //select the indexes
        for(var j=0; j<summary.length; j++){
            if(typeof summary[j][i] !== 'undefined' && typeof radius[i] !== 'undefined'){
                currStats.push(summary[j][i]);
            }
        }
        for(var k=0; k<currStats.length; k++){
            var index = radius.findIndex(item => item["label"] === currStats[k]["label"]);
            if(typeof radius[index] !== "undefined"){
                currStats[k]["value"] = radius[index].value;
            }
        }
        for(var k=0; k<currStats.length; k++){
            if(currStats[k]?.value == undefined){
                currStats.splice(k, 1);
            }
        }
        var currStatsLabelList = [];
        for(var k=0; k<currStats.length; k++){
            currStatsLabelList.push(currStats[i]["label"]);
        }
        
        dataList.push(currStats)
    }
    return dataList
}

//summarize the data the return the below format
function summarize_data(){

    sorted_data = [
        [
            {label: '1 Bedroom', time: 2007, radius: 77.85714285714286},
            {label: '1 Bedroom', time: 2008, radius: 90.47619047619048},
        ],
        [
            {label: '2 Bedrooms', time: 2008, radius: 86.48809523809524},
            {label: '2 Bedrooms', time: 2010, radius: 88.69047619047619},
            {label: '2 Bedrooms', time: 2009, radius: 100}
        ],
        [
            {label: '3 Bedrooms', time: 2007, radius: 80.21164285714286},
            {label: '3 Bedrooms', time: 2008, radius: 92.83333333333333},
            {label: '3 Bedrooms', time: 2009, radius: 93.44047619047619},
            {label: '3 Bedrooms', time: 2010, radius: 101.9672619047619},
            {label: '3 Bedrooms', time: 2011, radius: 108.42771428571429},
            {label: '3 Bedrooms', time: 2012, radius: 109.514}
        ],
        [               
            {label: '4 Bedrooms', time: 2011, radius: 127.11309523809524},
            {label: '4 Bedrooms', time: 2009, radius: 128.12352380952382},
            {label: '4 Bedrooms', time: 2010, radius: 137.63392857142858},
            {label: '4 Bedrooms', time: 2008, radius: 141.60257142857145},
            {label: '4 Bedrooms', time: 2012, radius: 151.86147619047617},
            {label: '4 Bedrooms', time: 2007, radius: 176.54761904761904}
        ],
        [
            {label: '5 Bedrooms', time: 2011, radius: 133.33333333333334},
            {label: '5 Bedrooms', time: 2008, radius: 145.23809523809524},
            {label: '5 Bedrooms', time: 2009, radius: 178.57142857142858},
            {label: '5 Bedrooms', time: 2007, radius: 190.47619047619048},
            {label: '5 Bedrooms', time: 2010, radius: 194.36507142857144},
            {label: '5 Bedrooms', time: 2012, radius: 241.66666666666666}
        ],
    ]
    summary = [
        [
            {label: '1 Bedroom', time: 2007, inner: 0, outer: 77.85714285714286, color: "rgb(100, 50, 0)"},
            {label: '1 Bedroom', time: 2008, inner: 77.85714285714286, outer: 90.47619047619048, color: "rgb(100, 50, 0)"},
        ],
        [
            {label: '2 Bedrooms', time: 2008, inner: 0, outer: 86.48809523809524, color: "rgb(255, 0, 0)"},
            {label: '2 Bedrooms', time: 2010, inner: 86.48809523809524, outer: 88.69047619047619, color: "rgb(255, 0, 0)"},
            {label: '2 Bedrooms', time: 2009, inner: 88.69047619047619, outer: 100, color: "rgb(255, 0, 0)"}
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
    "rScale": 4200, // 4200 is just a hard coded scale for this dataset, will implement a function to automatically adjust it
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
                    dataSet.labels.push({title: graphData.cols[i].title, color: graphData.cols[i].color});
                    dataSet.stats.push({label: graphData.cols[i].title, value: filtered[0]["frequency"], radius: 0, color: graphData.cols[i].color});
                    dataSet.radius.push({label: graphData.cols[i].title, value: filtered[0]["frequency"], radius: filtered[0]["price"]/this.rScale, color: graphData.cols[i].color}); 	
                }
            }

            var unfiltered = graphData.cols[i].stats
            // .filter(function(x) { return x.year != year;})
            console.log(unfiltered);
            for (var j = 0; j < unfiltered.length; j++)
            {
                filteredYear.push({label: graphData.cols[i].title, time: unfiltered[j]["year"], radius: unfiltered[j]["price"]/this.rScale});
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
            currStats.data = JSON.parse(JSON.stringify(dataSet.stats));
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

        var data = generate_current_data(radius, summary, graphData.rows.length);
        console.log(data);

        var arc = d3.svg.arc()
        .innerRadius(function (d){
            return d.data.inner
        })
        .outerRadius(function (d) { 
            return d.data.outer
        });
        
        
        var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { 
            return d.value; 
        });
            
        var svg =  d3.select('.pieChartSvg').append('svg').attr('width',width).attr('height',height)
        
        // console.log(data[0]);
        // svg.selectAll('path')
        // .data(pie(data[0]))
        // .enter()
        // .append('path')
        // .attr('d',arc)
        // .attr('transform','translate(250,250)')
        // .attr("fill", function(d) {
        //     return d.data.color;
        // })
        // .attr('stroke','white')
        // .style("opacity", 0.8)

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
            .style("opacity", 0.8)

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