import * as d3 from "d3"

import {selectNodeUpdate, hoverNodeUpdate, dblClickNodeUpdate} from "./provenanceSetup"

import { graph } from "./data";

import { angle, abbreviateNumber, flat_data, reScale, shallow_copy, check_dummy, get_time, get_curr_radius, find_inner, timeAngle, getSumYear } from "./utils";

export default class TimeSeriesPlot{

  margin:any;
  width:number;
  height:number;
  pie:any;
  currTime:any;
  scale:any;
  svg:any;
  legend:any;
  arc:any;
//   labelArc:any;
//   timeOppArc:any;
//   timeFronArc:any;
//   timeFirstArc:any;
  emptyArc:any;
  piedata:any;
  dataSet:any;
  data:any;
  firstTimeOrder: any;
  combinedStats:any;
  alignMode:boolean;
  graphData:any;

  //svg:d3.Selection<SVGSVGElement, any, HTMLElement, any>;

  constructor()
  {
    this.margin = {};
    this.width = (d3.select('.pieChart').node()! as HTMLElement).getBoundingClientRect().width;
    this.height = this.width;
    this.firstTimeOrder=[];
    this.combinedStats = [];
    this.alignMode = false;
    this.graphData = graph;
    this.graphData.rows.forEach((row:any) => {
        this.setData(row);
    })
    console.log("GraphData", this.graphData);
    this.currTime = this.graphData.rows[0];
    this.setData(this.graphData.rows[0]);
    console.log("GraphData", this.graphData);
    this.prepareChart();
    this.prepareData();
    this.plotPie();

  }


  setData(time:number)
  {
    this.dataSet = 
    {   
        "labelList": [],
        "labels": [],
        "labelsCat": [],
        "stats": [],
        "radius": []
    };
    var filteredtime = [];
    this.combinedStats = [];

    for (var i = 0; i < this.graphData.cols.length; i++)
    {   

        this.dataSet.labelsCat.push({title: this.graphData.cols[i].title, color: this.graphData.cols[i].color, firstTime: i});
        var filtered = this.graphData.cols[i].stats.filter(function(x:any) { return x.time == time;})
        console.log(filtered);
        if (filtered.length > 0)
        {   
            if (filtered[0].frequency > 0)
            {   
                this.dataSet.labelList.push({label: this.graphData.cols[i].title, value: filtered[0].frequency});
                this.dataSet.labels.push({title: this.graphData.cols[i].title, color: this.graphData.cols[i].color});
                this.dataSet.stats.push({label: this.graphData.cols[i].title, value: filtered[0].frequency, radius: 0, color: this.graphData.cols[i].color});
                this.dataSet.radius.push({label: this.graphData.cols[i].title, value: filtered[0].frequency, radius: this.graphData.cols[i].stats[0].average, color: this.graphData.cols[i].color}); 	
            }
        }

        var unfiltered = this.graphData.cols[i].stats
        for (var j = 0; j < unfiltered.length; j++)
        {
            filteredtime.push({label: this.graphData.cols[i].title, time: unfiltered[j].time, radius: unfiltered[j].average});
        }
        
    }


    //generate list of data corresponding the different times
    for (var i = 0; i < this.graphData.rows.length; i++)
    {   
        var currtime = this.graphData.rows[i];
        
        var currStats : any = {
            time: currtime, 
            data: []
        }
        currStats.data = shallow_copy(this.dataSet.stats);
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
        this.combinedStats.push(currStats);
    }

    var radius = this.dataSet.radius;
    if(time == this.graphData.rows[0]){
        radius.sort((a:any, b:any) => (a.value > b.value) ? 1 : -1)
        this.dataSet.labelList.sort((a:any, b:any) => (a.value > b.value) ? 1 : -1)
        this.firstTimeOrder = this.dataSet.labelList.map(function(d:any) { return d["label"]; });
    }else{
        radius.sort((a:any, b:any) => {  
            return this.firstTimeOrder.indexOf(a.label) - this.firstTimeOrder.indexOf(b.label);
        });
        this.dataSet.labelList.sort((a:any, b:any) => {  
            return this.firstTimeOrder.indexOf(a.label) - this.firstTimeOrder.indexOf(b.label);
        });
    }

    var labels = this.dataSet.labelList.map(function(d:any) { return d["label"]; });
    console.log("dataset is", this.dataSet);
    this.data = this.generate_current_data(radius, this.graphData.rows.length, labels, this.graphData.rows, time);
  }

  generate_current_data(radius:any, length:any, labels:any, timeList:any, currTime:any){ 
        this.update_graphData(radius, timeList, currTime)
        this.data = [];
        for(var i=0; i<length; i++){
            var newRs = get_curr_radius(labels, i);
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
                        var oldRadius = shallow_copy(this.data[i-1][j].outer);
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
            this.data.push(currData);
        }
        console.log("generate current data", this.data);
        return this.data;
    }
    
    update_graphData(radius:any, timeList:any, currTime:any){
        var prevTime = timeList.slice(0, timeList.indexOf(currTime));
        prevTime = prevTime.sort();
        for(var i=0; i<this.graphData.cols.length; i++){
            prevTime.forEach((time:number) => {
                const unique = Array.from(new Set(this.graphData.cols[i].stats.map((item:any) => item.time)));
                console.log("Unique is", unique);
                if(unique.indexOf(time) == -1){
                    //insert new data of the year
                    var dummy = {
                        time: 0, 
                        average: 0, 
                        frequency:0, 
                    };
                    dummy.time = time;
                    
                    dummy.frequency = 0;
                    this.graphData.cols[i].stats.unshift(dummy);
                }
            });
        }
        //update the average if the frequency is 0
        //sort the values of radius
        for(var i=0; i<this.graphData.cols.length; i++){
            var filtered = this.graphData.cols[i].stats.filter(function(x:any) { return x.frequency == 0;})
            filtered.forEach((dummy:any) => {
                var dummyData = shallow_copy(radius)
                dummyData.sort((a:any,b:any)=> {
                    if (a.value == b.value){
                        return a.radius > b.radius ? -1 : 1
                    } else {
                        return a.value > b.value ? 1 : -1
                    }
                });
                //console.log(dummyData);
                //find the title 
                var currTitle = this.graphData.cols[i].title;
                var index = dummyData.findIndex(function(o:any) {
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

  align(piedata:any, time: any)
  {
    //adjust the inner and outer radius for all the pie data

    //find the largest value to align
    var filteredData = piedata.filter(
        function(d:any){
            return d.data.time == time;
        });
    var max = Math.max(...filteredData.map(
        function(d:any){
            return d.data.inner;
        }));
    var diffArr: { title: any; diff: number; }[] = [];
    piedata.forEach(function(d:any){
        if(d.data.time == time){
            diffArr.push({"title": d.data.label, "diff": max-d.data.inner});
        }
    });

    //update other data correspondingly
    piedata.forEach(function(d:any){
        diffArr.forEach(a => {
            if(a.title == d.data.label){
                d.data.inner += a.diff;
                d.data.outer += a.diff;
            }
        });
    });
    return piedata;
  }

  prepareChart()
  {

    this.scale = reScale(this.width, this.data);

    //Plot the pie chart
    this.svg =  d3.select('.pieChartSvg')
    .attr('width',this.width)
    .attr('height',this.height)

    this.legend = d3.select(".pieLegendSvg");
    
    this.legend
    .html("")
    .style("height", function(d:any) {
        return ((2 * 5) + 2) + "em";
    }); 

    this.arc = d3.arc()
    .innerRadius(function (d:any){
        return d.data.inner/this.scale;
    })
    .outerRadius(function (d:any) { 
        return d.data.outer/this.scale;
    });

    
    this.emptyArc = d3.arc()
    .innerRadius(0)
    .outerRadius(0);
    
    
    this.pie = d3.pie()
    .value(function(d:any) { 
        return d.value; 
    })
    .sort(null);
  }

  plotPie()
  {
        this.updateChart();

          d3.select('.pieChart')
          .on("click", function (event, d){
            d3.select('.custom-menu')
            .style("opacity", 0);
          });

        

        this.dataSet.labelsCat.sort((a:any, b:any) => a.title.localeCompare(b.title))
        this.dataSet.labelsCat.forEach((a:any) => {
            var i = a.firstTime
            var j = 0;
            while(this.graphData.cols[i].stats[j].frequency == 0){
                j += 1;
            }
            a.firstTime = this.graphData.cols[i].stats[j].time;
        })

        this.legend
        .selectAll("rect")
        .data(this.dataSet.labelsCat)
        .enter()
        .append("rect")
        .attr("x", function(d:any) 
        {
            return 2 + "em";
        })
        .attr("y", function(d:any, i:any) 
        {
            return ((2 * i) + 1)  + "em";
        })
        .attr("fill", function(d:any) 
        {
            return d.color;
        })
        .attr("width", function(d:any) 
        {
            return (2 / 2) + "em";
        })
        .attr("height", function(d:any) 
        {
            return (2 / 2) + "em";
        })
        .attr("id", function(d:any){
            return "label_" + d.title.trim() + "_" + d.firstTime;
        })
        .on("click", (event:any, d:any) => {
            selectNodeUpdate("label_" + d.title.trim() + "_" + d.firstTime)
            this.setData(d.firstTime);
            this.setData(d.firstTime);
            this.prepareChart();
            this.prepareData();
            this.plotPie();
        });

        this.legend
        .selectAll("text")
        .data(this.dataSet.labelsCat)
        .enter()
        .append("text")
        .attr("x", function(d:any) 
        {
            return (2 * 2) + "em";
        })
        .attr("y", function(d:any, i:any) 
        {
            return ((2 * i) + 2)  + "em";
        })
        .text(function(d:any) 
        {   
            if(!isNaN(d.title)){
                return d.title + " " + "bedroom";
            }
            return d.title;
        });
  }

  updateChart() 
  {
    var local = d3.local();
    console.log(' pieData', this.piedata)


    let arcs = this.svg.selectAll('.arcWedge')
    .data(this.piedata, (d:any)=>d.data.label + '_' + d.data.time)
    .join((enter:any)=>  {
        //console.log(' enter selection' , enter.size());
            return enter
            .append('path')
            .classed('arcWedge',true)
            .each(function(d:any, i:any, n:any) {
                local.set(n[i], d)
            })
            .attr('transform', 'translate(' + this.width/2 +  ',' + this.height/2 +')')},

        (update:any)=>{ 
            console.log(' update selection' , update.size()); 
            return update
        },

        (exit:any)=>exit
            .transition()
            .duration(100)
            .attr('d', this.emptyArc)
            .on('end', function(d:any, i:any, n:any) {
                d3.select(n[i]).remove();
            })
        );
        arcs.each(function(d:any, i:any, n:any) {
            if(d.data.selected){
                d3.select(n[i]).classed('selected',true)
            }else{
                d3.select(n[i]).classed('selected',false)
            }
        })
        .transition()
        .duration(1000)
        .attrTween('d', (d:any, i:any, n:any) => {
            var interpolate = d3.interpolate(n[i]._current, d);
            var _this = n[i];
            return (t:any) => {
                _this._current = interpolate(t);
                return this.arc(_this._current);
            };
        })
        .attr('stroke',function(d:any){
            if(d.data.dummy){
                return 'black'
            }else{
                return 'white'
            }
            })
        .attr("stroke-width", 0.5)
        .style("stroke-dasharray", function(d:any){
            if(d.data.dummy){
                return ("1,3")
            }
        })
        
        .style('fill', function(d:any) {
            if(d.data.dummy){
                return 'url(#diagonal-stripe-3)'; 
            }else{
                return d.data.color;
            }
        })
        var self = this;
        var timeout: number | any;
        var currentHoveredSection="";

        arcs
        .filter(function(d:any) { 
            return !d.data.dummy; 
        })
        .on("mouseover", (event:any, d:any) => {
            //console.log(d.data, d);
            d3.select(event.currentTarget)
            .style("stroke", "black")
            .attr("stroke-width", 4)
            currentHoveredSection = "arc_" + d.data.label.trim() + "_" + d.data.time;
            timeout = event.timeStamp;

            d3.select("#tooltip")
            .style("left", event.pageX-this.width/4 + "px")
            .style("top", event.pageY-this.width/4 + "px")
            .style("opacity", 1)
            .select("#value")

            var thatYear = this.graphData.cols.find((o:any) => o.title == d.data.label);
            var actual = thatYear!.stats.find((o:any) => o.time == d.data.time)

            d3.select("#tooltip").html(
                        "Title: " + (d.data.label) + " " + "bedroom"
                        + "<br/>" + "Percentage: " + Number.parseInt(((actual!.frequency/getSumYear(d.data.time))*100).toString()) + "% (" + actual!.frequency + ")"
                        + "<br/>" + "time: " + d.data.time
                        + "<br/>" + "Value: " + d.data.radius)
        })
        .on("mouseout", function (event:any, d:any) {
        // Hide the tooltip
            d3.select(event.currentTarget)
            .style("stroke", "white")
            .attr("stroke-width", 0.5)
            d3.select("#tooltip")
            .style("opacity", 0);
            if(event.timeStamp - timeout >= 1500 && currentHoveredSection=="arc_" + d.data.label.trim() + "_" + d.data.time){
                console.log(currentHoveredSection, event.timeStamp - timeout);
                hoverNodeUpdate(currentHoveredSection, 0);
                
                  currentHoveredSection="";
    
                  hoverNodeUpdate("", Number.parseInt(((event.timeStamp - timeout)/1000).toString()))
            }else{
              timeout = event.timeStamp;
            }
        })

        arcs
        .filter(function(d:any) { 
            return !d.data.selected
        })
        .on("click", (event:any, d:any) => {
            if(!d.data.selected){
                this.alignMode = false;
                this.currTime = d.data.time;
                selectNodeUpdate("arc_" + d.data.label.trim() + "_" + this.currTime)
                this.setData(d.data.time);
                this.setData(d.data.time);
                this.prepareChart();
                this.prepareData();
                this.plotPie();
                //event.stopPropagation();
                //updateChart();
            }
        })

        arcs
        .filter(function(d:any) { 
            return d.data.selected
        })
        .on("dblclick", (event:any, d:any) => {
            event.preventDefault();
            if(d.data.selected){
                d3.select("#tooltip")
                .style("opacity", 0);
                this.alignMode = !this.alignMode;
                if(this.alignMode == true){
                    dblClickNodeUpdate("year_" + this.currTime);
                    this.align(this.piedata, d.data.time);
                    this.updateChart();
                }else{
                    dblClickNodeUpdate("reset_" + this.currTime);
                    this.currTime = d.data.time;
                    this.setData(d.data.time);
                    this.setData(d.data.time);
                    this.prepareChart();
                    this.prepareData();
                    this.plotPie();
                }

                d3.select("#tooltip")
                .style("opacity", 0);
            }
            
        })
        this.labelCatChart();
        this.labelChart();
  }

  prepareData()
  { 

    var target = this.pie(this.data[0]);
    this.data = [].concat(...this.data);
    console.log("original data", this.data);
    this.piedata = this.pie(this.data);
    console.log("unflated data", this.piedata);
    flat_data(target, this.piedata);
  }

  labelCatChart() {

    var self = this;

    var labelArc = d3.arc()
    .innerRadius(function (d:any){
        return d.data.outer/self.scale + 20;
    })
    .outerRadius(function (d:any) { 
        return d.data.outer/self.scale + 25;
    });

    var paras = document.getElementsByClassName('arcLabelWedge');

    while(paras[0]) {
        paras[0].parentNode!.removeChild(paras[0]);
    }

    //outer cat label
    let catLabelArcs = this.svg.selectAll('.arcLabelWedge')
    .data(this.piedata.slice(-this.dataSet.radius.length))
    .enter()
    .append('g')
    .classed('arcLabelWedge',true)
    .attr('transform', 'translate(' + this.width/2 +  ',' + this.height/2 +')')

    catLabelArcs.append('path')
    .attr('d', this.arc)
    .attr('fill', 'none')

    catLabelArcs
    .append("g:text")
    .attr("transform", function(d:any){
        return "translate(" + labelArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d:any) {
        var labelName = "";
        if(!isNaN(d.data.label)){
            labelName = d.data.label + " " + "bedroom";
        }else{
            labelName = d.label;   
        }
        if(d.endAngle - d.startAngle >= Math.PI/8){
            return labelName;
        }else{
            return d.data.label + " bdr";
        }
  
    })
    .filter(function(d:any) { 
        return d.startAngle >= 3*Math.PI/2 || d.endAngle >= 3*Math.PI/2; 
    })
    .classed("flipText", true)
}

labelChart() {

    //clean up
    var paras = document.getElementsByClassName('arcTimeWedge');

    while(paras[0]) {
        paras[0].parentNode!.removeChild(paras[0]);
    }

    paras = document.getElementsByClassName('smallArcTimeWedge');

    while(paras[0]) {
        paras[0].parentNode!.removeChild(paras[0]);
    }

    this.svg
    .append("g")
    .classed('arcTimeWedge',true)
    .attr("transform","translate("+this.width/2 +","+(this.height+10)/2+")")
    .append("text")
    .classed("currTimeLabel", true)
   .attr("text-anchor", "middle")
   .text(this.currTime);

    let selected_data = this.piedata.filter(function(d:any){
        return !d.data.dummy && d.data.radius != 0;
    })

    //do label
    let timeLabelArcs = this.svg.selectAll('.arcTimeWedge')
    .data(selected_data)
    .enter()
    .append('g')
    .classed('arcTimeWedge',true)
    .attr('transform', 'translate(' + this.width/2 +  ',' + this.height/2 +')')

    this.labelArcs(timeLabelArcs);
}

labelArcs(dataArcs:any) {

    var self = this;

    this.arc = d3.arc()
    .innerRadius(function (d:any){
        return d.data.inner/self.scale;
    })
    .outerRadius(function (d:any) { 
        return d.data.outer/self.scale;
    });

    var timeOppArc = d3.arc()
    .innerRadius(function (d:any){
        return d.data.outer/self.scale - 20; 
    })
    .outerRadius(function (d:any) { 
        return d.data.outer/self.scale - 20;
    });

    var timeFirstArc = d3.arc()
    .innerRadius(function (d:any){
        return d.data.outer/self.scale - 30; 
    })
    .outerRadius(function (d:any) { 
        return d.data.outer/self.scale - 30;
    });

    var timeFronArc = d3.arc()
    .innerRadius(function (d:any){
        return d.data.outer/self.scale - 26; 
    })
    .outerRadius(function (d:any) { 
        return d.data.outer/self.scale - 26;
    });

    dataArcs.append('path')
    .attr('d', this.arc)
    .attr("id", function(d:any, i:any) { 
        return i; 
    })
    .attr('fill', 'none')

    dataArcs
    .filter(function(d:any) { 
        var middle_angle = (d.startAngle + d.endAngle)/2
        return middle_angle <= Math.PI/4; 
    })
    .append("g:text")
    .classed("innerText", function(d:any) {
        return d.data.selected;
    })
    .attr("transform", function(d:any){
        return "translate(" + timeFirstArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d:any) {
        return abbreviateNumber(d.data.radius);    
    });

    dataArcs
    .filter(function(d:any) { 
        var middle_angle = (d.startAngle + d.endAngle)/2
        return middle_angle >= 5*Math.PI/4 && middle_angle <= 7 * Math.PI/4 && middle_angle > Math.PI/4; 
    })
    .append("g:text")
    .classed("innerText", function(d:any) {
        return d.data.selected;
    })
    .attr("transform", function(d:any) {
        return "translate(" + timeOppArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d:any) {
        return abbreviateNumber(d.data.radius);    
    });

    dataArcs
    .filter(function(d:any) { 
        var middle_angle = (d.startAngle + d.endAngle)/2
        return (middle_angle < 5*Math.PI/4 || middle_angle > 7 * Math.PI/4) && middle_angle > Math.PI/4; 
    })
    .append("g:text")
    .classed("innerText", function(d:any) {
        return d.data.selected;
    })
    .attr("transform", function(d:any){
        return "translate(" + timeFronArc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .attr("text-anchor", "middle")
    .classed('timeLabelText', true)
    .text( function(d:any) {
        return  abbreviateNumber(d.data.radius);    
    });

    dataArcs
    .append("g:text")
    .classed("rotateTime", true)
    .classed("innerText", function(d:any) {
        return d.data.selected;
    })
    .append("textPath")
    .attr("href", function(d:any, i:any){
        return '#'+i;
    })
    .attr("alignment-baseline", "hanging")
    .attr("text-anchor", "start")
    //transition angle if d.startangle is larger than Math.PI and smaller than 3*Math.PI/2
    .text( function(d:any) {
        return d.data.time;    
    })
    .attr('fill', function(d:any) {
        if(d.data.selected){
            return "none";
        }
    });

    dataArcs
    .select('.rotateTime')
    .attr("transform", function(d:any, i: any, n:any) {
        var box = d3.select(n[i]).node().getBBox();
        // console.log(box.x, box.y)
        // console.log(box);
        return "rotate(" + timeAngle(d) + "," + (box.x+box.width/2) + "," + (box.y+box.height/2-2) + ")";
        // translate(" + (box.x) + "," + (box.y) + ") 
    })

    this.svg.selectAll('.arcTimeWedge')
    .each(function(d:any, i: any, n:any) {
        //console.log(d3.select(this).node());
        var currNode = d3.select(n[i]).node();
        // console.log(d3.select(this));
        if(d3.select(n[i]).node().childNodes.length == 3){
            // console.log(currNode.childNodes[0]);
            var arcPathNode = currNode.childNodes[0];
            var arcTextNode = currNode.childNodes[1];
            var arcTimeNode = currNode.childNodes[2];
            if(arcPathNode.getBBox().width <= arcTextNode.getBBox().width * 1.75 || arcPathNode.getBBox().width <= arcTimeNode.getBBox().width * 1.75){
                arcTextNode.style.display = "none";
                arcTimeNode.style.display = "none";
            }
        }

    })
}


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

  /**
  * Ensures the previously dblclicked node is no longer dblclicked
  * If dblclickedNode is not empty, hovers the new node
  */

  dblClickNode(dblClickNode:string)
  {
    d3.select(".dblClickNode")
      .classed("dblClickNode", false)

    if(dblClickNode !== "")
    {
      d3.select("#" + dblClickNode)
        .classed("dblClickNode", true)
    }
  }
}
