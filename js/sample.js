// Note: for animation and fancy styling, https://www.amcharts.com/demos/variable-radius-pie-chart/ is an library to enhance the visualization for pie chart that I found, but not sure if I can use it

function read_csv(){

}

// count the frequency of the catogorical variables
function count_freq(){

}

// generate/randomize color and assign them to each of the catogorical variables
function generate_color(){

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
    "scale": 12, 
    "rScale": 5000, // 3000 is just a hard coded scale for this dataset, will implement a function to automatically adjust it
    "dataWidth": 20,
    "dataSpacing": 2,
    "setData": function ()
    {   
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

            var unfiltered = graphData.cols[i].stats.filter(function(x) { return x.year != year;})
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
            if(currYear == year){
                continue;
            }
            
            var currStats = {
                time: currYear, 
                data: dataSet.stats
            }
            for (var j = 0; j < filteredYear.length; j++)
            {   
                //same year same label
                if(currYear == filteredYear[j]["time"] && filteredYear[j]["label"] == currStats.data["label"])
                {   
                    currStats.data["radius"] = filteredYear[j]["value"]
                    
                }
            }
            combinedStats.push(currStats);
        }

        console.log(combinedStats);
        console.log(dataSet);

        var container = d3.select(".pieChartContaine");
        var wrapper = d3.select(".pieChart");
        var chart = d3.select(".pieChartSvg");
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
        



        chart = d3.select(".pieChartSvg")
        .append('svg')
        .attr('width',500)
        .attr('height',500)
        .append("g")
        .attr("transform", "translate(" + (config.dataSpacing + config.dataWidth) * (config.scale / 2) + "," + (config.dataSpacing + config.dataWidth) * (config.scale / 2) + ")");
        

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

        var stats = dataSet.stats;
        var radius = dataSet.radius;

        console.log(stats);
        console.log(radius);

        
        var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(function (d) { 
            return d.data.radius
        });
        
        
        var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { 
            return d.value; 
        });
            
        var svg =  d3.select('.pieChartSvg').append('svg').attr('width',500).attr('height',500)
        
        svg.selectAll('path')
        .data(pie(radius))
        .enter()
        .append('path')
        .attr('d',arc)
        .attr('transform','translate(250,250)')
        .attr("fill", function(d) {
            return d.data.color;
        })
        .attr('stroke','white')
        .style("opacity", 0.7)

        svg.selectAll("arc")
        .data(pie(stats))
        .enter()
        .append('path')
        .attr('d',arc)
        .attr('transform','translate(250,250)')
        .attr("fill", function(d) {
            return d.data.color;
        })
        .attr('stroke','white')
        .style("opacity", 0.4)

        // svg.selectAll('text')
        // .data(pie(data))
        // .enter()
        // .append('text')
        // .attr("transform", function(d) { 
        //     return "translate(" + arc.centroid(d) + ")"; 
        // })
        // .text(function(d){ 
        //     console.log(d.data.value);
        //     return d.data.value;
        // })
        // .style("text-anchor", "middle")
        // .style("font-size", 17)
        
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
