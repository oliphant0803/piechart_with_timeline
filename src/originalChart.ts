import * as d3 from "d3"

import {selectNodeUpdate, hoverNodeUpdate} from "./provenanceSetup"

import { data, data2007, data2008, data2009, data2010, data2011, data2012, graphData } from "./data";

import { angle, abbreviateNumber } from "./utils";

export default class OriginalPlot{

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

    this.draw_pie_o(2007, data2007);
    this.draw_pie_o(2008, data2008);
    this.draw_pie_o(2009, data2009);
    this.draw_pie_o(2010, data2010);
    this.draw_pie_o(2011, data2011);
    this.draw_pie_o(2012, data2012);
  }

  draw_pie_o(time:number, compareSet:any){

    // var width = d3.select('.pieChart').node().getBoundingClientRect().width;
    // var height = width;
    var cat_title = "Bedroom"
    var widthO = (d3.select('.pieChart2007').node()! as HTMLElement).getBoundingClientRect().width;
    var heightO = widthO;


    var chartO = d3.select(".pieChartSvg"+time)
    .attr('width',widthO)
    .attr('height',heightO) 

    var pieO = 
    d3.pie()
    .sort(null)
    .value(function(d:any) 
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
    .data(pieO(compareSet.stats as any))
    .enter()
    .append("g")
    .attr('transform', 'translate(' + widthO/2 +  ',' + heightO/2 +')')
    .classed('arc'+time,true)
    .attr("id", function(d:any) {
        return "donut_" + d.data.label.trim() + "_" + time;
    })
    .append('path')
    .attr("id", function(d, i) { 
        return i+"time"+time; 
    })
    .attr('d',arcO as any)
    .style('fill', function(d:any) {
        return d.data.color;
    })

    var sumO = 0;
    compareSet.stats.forEach((stat: { value: number; }) => {
        sumO += stat.value;
    });

    var timeout: number | any;
    //var hovered=false;
    var currentHoveredSection="";

    
    arcChart
    // .on("click", function(d:any){
    //   return selectNodeUpdate("donut_" + d.data.label.trim() + "_" + time)
    // })
    .on("mouseover", function (event:any, d:any) {
        //initialize the timeout if first time
        currentHoveredSection = "donut_" + d.data.label.trim() + "_" + time;
        timeout = event.timeStamp;
        // if (hovered == false){
        //   hovered = true;
          
        // }
        d3.select("#tooltip")
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .style("opacity", 1)
        .select("#value")
        d3.select("#tooltip").html(
                    "Title: " + (d.data.label) + " " + cat_title
                    + "<br/>" + "Percentage: " + Number.parseInt(((d.value/sumO)*100).toString()) + "% (" + d.value + ")"
                    + "<br/>" + "time: " + time
                    + "<br/>" + "Value: " + d.data.price)
        
        //console.log(event.timeStamp);
        // if (!timeout) {
        //   timeout = window.setTimeout(function() {
        //       timeout = null;
        //       hovered = true;
        //       hoverNodeUpdate("donut_" + d.data.label.trim() + "_" + time);
        //   }, 2000);
        // }

        // // if (timeout) {
        // //     window.clearTimeout(timeout);
        // //     timeout = null;
        // // }
        // // else {
        // //     hoverNodeUpdate("donut_" + d.data.label.trim() + "_" + time);
        // // }
        // clearTimeout(timeout);
        // timeout = setTimeout(function() {
        //   hovered = true;
        //   hoverNodeUpdate("donut_" + d.data.label.trim() + "_" + time);
        // }, 2000);
        //return hoverNodeUpdate("donut_" + d.data.label.trim() + "_" + time)
    })
    .on("mouseout", function (event:any, d:any) {
        // Hide the tooltip
            d3.select("#tooltip")
            .style("opacity", 0);
        console.log("outevent "+ event.timeStamp);
        console.log("overevent "+ timeout);
        if(event.timeStamp - timeout >= 1500 && currentHoveredSection=="donut_" + d.data.label.trim() + "_" + time){
            console.log(currentHoveredSection, event.timeStamp - timeout);
            hoverNodeUpdate(currentHoveredSection);
            
              currentHoveredSection="";

              hoverNodeUpdate("")
        }else{
          timeout = event.timeStamp;
        }
    })

    chartO
    .append("g")
    .attr("transform","translate("+widthO/2 +","+(heightO+10)/2+")")
    .append("text")
    .classed("currTimeLabel", true)
    .attr("text-anchor", "middle")
    .text(time);

    chartO.selectAll('.arc'+time)
    .filter(function(d:any) { 
        return d.endAngle - d.startAngle >= Math.PI/8; 
    })
    .append("text")
    .classed("innerText", true)
    .attr("transform", function(d:any) {
        return "translate(" + arcPriceO.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d:any) {
        return abbreviateNumber(d.data.price);    
    });

    chartO.selectAll('.arc'+time)
    .filter(function(d:any) { 
        return d.endAngle - d.startAngle >= Math.PI/8; 
    })
    .append("text")
    .attr("transform", function(d:any) {
        return "translate(" + arcLabelO.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d:any) {
        if(!isNaN(d.data.label)){
            return d.data.label + " " + cat_title;
        }
        return d.data.label;     
    })
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
