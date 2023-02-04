import { graphData } from "./data";


function abbreviateNumber(num:number) {
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

function angle(d:any) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI;
    return a > 90 && a < 270 ? a - 180 : a;
}

function flat_data(target:any, piedata:any){
  var length = target.length;
  //for every length of piedata
  for(var i=0; i<length; i++){
      for(var j=i; j<piedata.length; j+=length){
          piedata[j].startAngle = target[i].startAngle;
          piedata[j].endAngle = target[i].endAngle;
          
      }
  }
}

function reScale(width:number, data:any){
  //go to the last interval's index
  var max = 0;
  for(var i=0; i<data[data.length-1].length; i++){
      if (max < data[data.length-1][i].outer){
          max = data[data.length-1][i].outer;
      }
  }
  return max/width*2;
}

function shallow_copy(item:any){
  if(item != undefined){
      return JSON.parse(JSON.stringify(item));
  }
}

function check_dummy(label:any, time:any){
  var dummies : any[] = [];
  var isDum = false;
  for(var i=0; i<graphData.cols.length; i++){
      graphData.cols[i].stats.forEach((stat:any) => {
          if(stat != undefined && stat.frequency == 0){
              dummies.push({
                  'stat':stat, 
                  'label':graphData.cols[i].title
              });
          }
      })
  }
  dummies.forEach(dummy => {
      if(dummy.stat.time == time && dummy.label == label){
          isDum = true;
          return;
      }
  });
  return isDum;
}

function get_time(label:any, radius:any){
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

function find_inner(radius:any){
  var sumR = 0;
  radius.forEach((r:any) => {
      sumR += r.radius;
  });
  return sumR/radius.length;
}

function get_curr_radius(labels:any, time:number){
  var new_radius = []
  for(var i=0; i<labels.length; i++){
      for(var j=0; j<graphData.cols.length; j++){
          if(graphData.cols[j].title == labels[i] && typeof graphData.cols[j].stats[time] != "undefined"){
              new_radius.push(graphData.cols[j].stats[time]["average"]);
          }else if(graphData.cols[j].title == labels[i] && typeof graphData.cols[j].stats[time] == "undefined"){
              new_radius.push(0);
          }
      }
  }
  return new_radius;
}

function timeAngle(d:any) {
  var middle_angle = (d.startAngle + d.endAngle)/2
  if ((d.startAngle <= 3*Math.PI/2 && d.startAngle >= Math.PI )|| (middle_angle >= Math.PI && middle_angle <= 3/2*Math.PI)){
      return 180;
  }else{
      return 0;
  }
}

export { angle, 
  abbreviateNumber, 
  flat_data, 
  reScale, 
  shallow_copy, 
  get_time, 
  check_dummy, 
  get_curr_radius, 
  find_inner,
  timeAngle };