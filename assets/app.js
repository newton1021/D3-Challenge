/* id	
state	
abbr	*/

columns = {
	"poverty":"Poverty",
	"povertyMoe":"Poverty Moe",
	"age":"Age",
	"ageMoe":"Age Moe",
	"income":"Income",
	"incomeMoe":"Income Moe",
	"healthcare":"Healthcare",
	"healthcareLow":"Healthcare Low",
	"healthcareHigh":"Healthcare High",
	"obesity":"Obesity",
	"obesityLow":"Obesity Low",
	"obesityHigh":"Obesity High",
	"smokes":"Smokes",
	"smokesLow":"Smokes Low",
	"smokesHigh":"Smokes High"
}

var xfield = "income"
var yfield = 'age'


colList = Object.keys(columns)
var firstList = d3.select('#firstList')
.selectAll('option')
.data(colList)
.enter()
.append('option')
.attr('value',d => d)
.text(d=>columns[d]);

var secondList = d3.select('#secondList')
.selectAll('option')
.data(colList)
.enter()
.append('option')
.attr('value',d => d)
.text(d=>columns[d]);





function selectionChanged(value, which) {
	if (which == 1) {
		xfield = value
	}
	else if (which == 2) {
		yfield = value
	}
	 
	updateGraph()
}

var datafile = "assets/data.csv";

function updateGraph() {
	var svgArea = d3.select("#scatter")
	if (!svgArea.empty()) {
		svgArea.select('svg').remove();
	}
	
	var svgWidth = window.innerWidth * 0.4;
	var svgHeight = svgWidth * 0.6;
	
	var margin = {
		top: 50,
		right: 50,
		bottom: 50,
		left: 50
	};
	
	var height = svgHeight - margin.top - margin.bottom;
	var width = svgWidth - margin.left - margin.right;
	
	
	var svg = svgArea
	.append("svg")
	.attr("height", svgHeight)
	.attr("width", svgWidth);
	
	var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);
	
	d3.csv(datafile).then( data=>{
		data.forEach(d => {
			d[xfield] = +d[xfield];
			d[yfield] = +d[yfield];
		})

		var xScale = d3.scaleLinear()
		.domain(d3.extent( data, d=>d[xfield]))
		.range([0, width]);
		
		var yScale = d3.scaleLinear()
		.domain(d3.extent( data, d=>d[yfield]))
		.range([height, 0]);
		
		
		var xAxis= d3.axisBottom(xScale);
		var yAxis = d3.axisLeft(yScale);
				
		
		var drawLine = d3.line()
		.x(d => xScale(d[xfield]))
		.y(d => yScale(d[yfield]))
		
		
		var pointsGroup = chartGroup.append("g")
		
		var circleGroup = pointsGroup.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(d[xfield]))
		.attr('cy', d => yScale(d[yfield]))
		.attr("r", "15")
		.attr("stroke", "gray")
		.attr('fill', 'orange')
		.attr('class', 'stateCircle');
		
		pointsGroup.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.attr('x', d => xScale(d[xfield]) )
		.attr('y', d => yScale(d[yfield])+5)
		.attr('text-anchor', 'middle')
		.attr('stroke', 'blue')
		.style("font-size", 12)
		.text(d=>d.abbr);
		
		

		console.log("Starting y - axis")
		chartGroup.append("g")
		.classed("axis", true)
		.call(yAxis)
		
		var ypos = height/2;
		
		
		chartGroup.append('g')
		.append('text')
		.attr("x", -ypos -10)
		.attr("y", -30)
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor' , 'middle')
		.text(columns[yfield])
		
		
		console.log("Starting x - axis")
		chartGroup.append('g')
		.append('text')
		.attr("x", width/2)
		.attr("y",height + 40)
		.attr('text-anchor' , 'middle')
		.text(columns[xfield])

		chartGroup.append("g")
		.text(xfield)
		.classed("axis", true)
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis);
		
		var toolTip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-2, -2])
		.html(function(d) {
			return (`<p><strong>${d.state}</strong><br>${columns[xfield]}: ${d[xfield]}<br>${columns[yfield]}: ${d[yfield]}</p>`);
		});
		
		// Step 2: Create the tooltip in chartGroup.
		chartGroup.call(toolTip);
		
		// Step 3: Create "mouseover" event listener to display tooltip
		circleGroup.on("mouseover", function(d) {
			toolTip.show(d, this);
		})
		// Step 4: Create "mouseout" event listener to hide tooltip
		.on("mouseout", function(d) {
			toolTip.hide(d);
		});
//
		
	}).catch(error => console.log(error));
	
}

function init(){
	d3.select("#firstColumn").selectAll('option').filter(d => d.value == xfield).attr("selected", true);
}

init()
updateGraph();
d3.select(window).on("resize", updateGraph());