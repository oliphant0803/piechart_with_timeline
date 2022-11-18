var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

const splitLongString = (str, count) => {
    const partLength = Math.round(str.length / count);
    const words = str.split(' ');
    const parts = [];
    str.split(' ').forEach(part => {
    if (!parts.length) {
      parts.push(part);
    }
    else {
      const last = parts[parts.length - 1];
      if (parts[parts.length - 1].length >= partLength)
      parts.push(part);
    else  
      parts[parts.length - 1] += ' ' + part;
    }
  });
  return parts;
  };

//   const data = [
//     {value: 30, text: 'First', color: 'red'},
//     {value: 40, text: 'Second', color: 'green'},
//     {value: 60, text: 'Third', color: 'blue'},
//     {value: 50, text: 'A very very very very very very very very long text', color: 'yellow'},
//   ];
  
  
//   const svg = d3.select('svg');
//   const width = parseInt(svg.attr('width'));
//   const height = parseInt(svg.attr('height'));
  
//   const margin = 10;
//   const arcWidth = 50;
//   const radius = Math.min(width/2 - margin, height/2 - margin) - arcWidth / 2;
//   const center = {x: width / 2, y: height / 2};
  
//   let anglePos = 0;
//   const angleOffset = 0.025;
  
//   const sum = data.reduce((s, {value}) => s + value, 0);
//   data.forEach(({value, text, color}, index) => {
//       const angle = Math.PI * 2 * value / sum;
//     const startAngle = anglePos + angleOffset;
//     anglePos += angle;
//     const endAngle = anglePos - angleOffset;
//     const start = {
//       x: center.x + radius * Math.sin(startAngle),
//       y: center.y + radius * -Math.cos(startAngle),
//     };
//     const end = {
//       x: center.x + radius * Math.sin(endAngle),
//       y: center.y + radius * -Math.cos(endAngle),
//     };
//     const flags = value / sum >= 0.5 ? '1 1 1' : '0 0 1';
//     const pathId = `my-pie-chart-path-${index}`;
//     const path = svg.append('path')
//       .attr('id', pathId)
//       .attr('d', `M ${start.x},${start.y} A ${radius},${radius} ${flags} ${end.x},${end.y}`)
//       .style('stroke', color)
//       .style('fill', 'none')
//       .style('stroke-width', arcWidth);
      
//     const len = path.node().getTotalLength();
    
//     const textElement = svg.append('text')
//       .text(text)
//       .attr('dy', 0)
//       .attr('text-anchor', 'middle');
//     const width = textElement.node().getBBox().width;  
//     let texts = [text];
//     if (width > len)
//       texts = splitLongString(text, Math.ceil(width / len));
          
//     textElement.text(null);
    
//     // const midAngle = anglePos - angle / 2;
    
//     texts.forEach((t, i) => {
//       const textPathId = `my-pie-chart-path-${index}-${i}`;
//       const textRadius = radius - i * 12;
//       const textStart = {
//       x: center.x + textRadius * Math.sin(startAngle),
//       y: center.y + textRadius * -Math.cos(startAngle),
//     };
//     const textEnd = {
//       x: center.x + textRadius * Math.sin(endAngle),
//       y: center.y + textRadius * -Math.cos(endAngle),
//     };
  
//     const path = svg.append('path')
//       .attr('id', textPathId)
//       .attr('d', `M ${textStart.x},${textStart.y} A ${textRadius},${textRadius} ${flags} ${textEnd.x},${textEnd.y}`)
//       .style('stroke', 'none')
//       .style('fill', 'none');
    
//     textElement.append('textPath')
//       .text(t)
//       .attr('startOffset', (endAngle - startAngle) * textRadius / 2)
//       .attr('href', `#${textPathId}`)
//     });
  
//   });