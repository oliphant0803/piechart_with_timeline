import * as d3 from "d3"

import {selectNodeUpdate, hoverNodeUpdate} from "./provenanceSetup"

import { data, data2007, graphData } from "./data";

import { angle, abbreviateNumber } from "./utils";

export default class TimeSeriesPlot{

  margin:any;
  width:number;
  height:number;
  //svg:d3.Selection<SVGSVGElement, any, HTMLElement, any>;

  constructor()
  {
    this.margin = {};
    this.width = 0;
    this.height = 0;
    // this.svg = d3.select("#mainDiv")
    //   .append("svg")

    this.draw_pie_o(2007)
    // this.draw_pie_o(2008)
    // this.draw_pie_o(2009)
    // this.draw_pie_o(2010)
    // this.draw_pie_o(2011)
    // this.draw_pie_o(2012)
  }

  draw_pie_o(time:number){

    // var width = d3.select('.pieChart').node().getBoundingClientRect().width;
    // var height = width;
    var cat_title = "Bedroom"
    var widthO = d3.select('.pieChart2007').node().getBoundingClientRect().width;
    var heightO = widthO;


    //find the data of the given time
    var compareSet = data2007;

    var chartO = d3.select(".pieChartSvg"+time)
    .attr('width',widthO)
    .attr('height',heightO) 

    var pieO = 
    d3.pie()
    .sort(null)
    .value(function(d) 
    {
        return d.value; 
    });


    var arcO = d3.arc()
    .innerRadius(50)
    .outerRadius(Math.min(widthO, heightO) / 2 - 40 );

    var arcLabelO = d3.arc()
    .innerRadius(Math.min(widthO, heightO) / 2 - 35)
    .outerRadius(Math.min(widthO, heightO) / 2 + 5);

    var arcPriceO = d3.arc()
    .innerRadius(Math.min(widthO, heightO) / 2 - 75)
    .outerRadius(Math.min(widthO, heightO) / 2 - 55);

    var arcChart = chartO.selectAll('.arc'+time)
    .data(pieO(compareSet.stats))
    .enter()
    .append("g")
    .attr('transform', 'translate(' + widthO/2 +  ',' + heightO/2 +')')
    .classed('arc'+time,true)
    .append('path')
    .attr("id", function(d, i) { 
        return i+"time"+time; 
    })
    .attr('d',arcO)
    .style('fill', function(d) {
        return d.data.color;
    })

    arcChart
    .on("mouseover", function (event, d) {
        d3.select("#tooltip")
        .style("left", event.pageX-widthO/4 + "px")
        .style("top", event.pageY-widthO/4 + "px")
        .style("opacity", 1)
        .select("#value")
        d3.select("#tooltip").html(
                    "Title: " + (d.data.label) + " " + cat_title
                    + "<br/>" + "Percentage: " + (d.value/sumA).toFixed(2)*100 + "% (" + d.value + ")"
                    + "<br/>" + "time: " + time
                    + "<br/>" + "Value: " + d.data.price)
    })
    .on("mouseout", function () {
        // Hide the tooltip
            d3.select("#tooltip")
            .style("opacity", 0);
    })

    chartO
    .append("g")
    .attr("transform","translate("+widthO/2 +","+(heightO+10)/2+")")
    .append("text")
    .classed("currTimeLabel", true)
    .attr("text-anchor", "middle")
    .text(time);

    chartO.selectAll('.arc'+time)
    .filter(function(d) { 
        return d.endAngle - d.startAngle >= Math.PI/8; 
    })
    .append("text")
    .classed("innerText", true)
    .attr("transform", function(d) {
        return "translate(" + arcPriceO.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d) {
        return abbreviateNumber(d.data.price);    
    });

    chartO.selectAll('.arc'+time)
    .filter(function(d) { 
        return d.endAngle - d.startAngle >= Math.PI/8; 
    })
    .append("text")
    .attr("transform", function(d) {
        return "translate(" + arcLabelO.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d) {
        if(!isNaN(d.data.label)){
            return d.data.label + " " + cat_title;
        }
        return d.data.label;     
    })

    //need to assign id to each node first
    chartO.selectAll('.arc'+time)
    .on("click", d => selectNodeUpdate("node_" + d.id))
    .on("mouseover", d => hoverNodeUpdate("node_" + d.id))
    .on("mouseout", d => hoverNodeUpdate(""))
  }

  

  /**
  * Creates an svg and draws the initial visualization
  */

  // initializeVis()
  // {
  //   this.svg
  //     .attr("width", this.width + this.margin.left + this.margin.right)
  //     .attr("height", this.height + this.margin.top + this.margin.bottom)

  //   let currData = this.data.filter(d => {
  //     return d.dataset === this.quartetNum;
  //   })

  //   this.svg.selectAll("circle")
  //     .data(currData)
  //     .enter()
  //     .append("circle")
  //     .attr("class", "normalNode")
  //     .attr("id", d => "node_" + d.id)
  //     .attr("cx", d => this.xScale(+d.x))
  //     .attr("cy", d => this.height - this.yScale(+d.y))
  //     .on("click", d => selectNodeUpdate("node_" + d.id))
  //     .on("mouseover", d => hoverNodeUpdate("node_" + d.id))
  //     .on("mouseout", d => hoverNodeUpdate(""))
  // }

  /**
  * Filters the data so that only points associated with the new quartet are used
  * Updates each circle and transitions them to their new position
  */

  // changeQuartet(newQuartet:string)
  // {
  //   this.quartetNum = newQuartet;

  //   let currData = this.data.filter(d => {
  //     return d.dataset === this.quartetNum;
  //   })

  //   this.svg.selectAll("circle")
  //     .data(currData)
  //     .attr("id", d => "node_" + d.id)
  //     .transition()
  //     .duration(750)
  //     .attr("cx", d => this.xScale(+d.x))
  //     .attr("cy", d => this.height - this.yScale(+d.y))
  // }

  /**
  * Ensures the previously selected node is no longer selected
  * Selects the new node
  */

  selectNode(selectedNode:string)
  {
    d3.select(".selectedNode")
      .classed("selectedNode", false)

    d3.select("#" + selectedNode)
      .classed("selectedNode", true)
  }

  /**
  * Ensures the previously hovered node is no longer hovered
  * If hoverNode is not empty, hovers the new node
  */

  hoverNode(hoverNode:string)
  {
    d3.select(".hoverNode")
      .classed("hoverNode", false)

    if(hoverNode !== "")
    {
      d3.select("#" + hoverNode)
        .classed("hoverNode", true)
    }
  }
}
