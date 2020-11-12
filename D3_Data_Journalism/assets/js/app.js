// @TODO: YOUR CODE HERE!
function xScale(stateData, chosenXAxis) {
  //initializing scale
    const xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) - 1,
          d3.max(stateData, d => d[chosenXAxis] + 1)
      ])
      .range([0, width]);
  
    return xLinearScale;
  //
    function renderAxes(newXScale, xAxis) {
  
      const bottomAxis = d3.axisBottom(newXScale);
  
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
      
  
      return xAxis;
    }
  
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    
      return circlesGroup;
    }
  
    function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis) {
    
      textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));
    
      return textcirclesGroup;
    }
  
    function updateToolTip(chosenXAxis, circlesGroup) {
    
      var label;
    
      if (chosenXAxis === "poverty") {
        label = "In Poverty (%)";
      }
      else if (chosenXAxis === "age") {
        label = "Age (Median)";
      } else {
        label = "Household Income (Median)"
      }
    
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([75, -65])
        .html(function(d) {
          return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });
  
      circlesGroup.call(toolTip);
  
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
  
        .on("mouseout", function(data,index) {
          toolTip.hide(data);
        });
  
      return circlesGroup;
  
  }
  }
  
  
  
  
  //assigning variable sizes(pixels)
  var svgWidth = 950;
  var svgHeight = 500;
  
  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  
  
  let chosenXAxis = "poverty";
  
  d3.csv("./assets/data/data.csv").then (function(stateData, err) {
      if (err) throw err;
  
      stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcareLow = +data.healthcareLow;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
      });
  
      console.log(stateData);
  
      const yTitle = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Obese (%)");
  
      
      const xLinearScale = xScale(stateData, chosenXAxis);
  
      const bottomAxis = d3.axisBottom(xLinearScale);
  
      const xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
  
      const yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.obesity)])
        .range([height, 0]);
  
      const leftAxis = d3.axisLeft(yLinearScale);
  
      const yAxis = chartGroup.append("g")
        .call(leftAxis);
  
  
  
  
  
      const circlesGroupAll = chartGroup 
        .selectAll("circlesGroup")
        .data(stateData)
        .enter()
  
  
      const circlesGroup = circlesGroupAll
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");
  
      const textcirclesGroup = circlesGroupAll
        .append("text")
        .text((d) => Math.round(xLinearScale(d[chosenXAxis])))
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d.obesity));
  
      const labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      const inPoverty = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
      
      const age = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("active", true)
        .text("Age (Median)");
  
      const householdIncome = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("active", true)
        .text("Household Income (Median)");
  
      
      let circles = updateToolTip(chosenXAxis, circlesGroup);
      let textcircles = updateToolTip(chosenXAxis, textcirclesGroup);
        
  
      labelsGroup.selectAll("text")
        .on("click", function() {
  
          const value = d3.select(this).attr("value");
          console.log(value);
          if (value !== chosenXAxis) {
  
            chosenXAxis = value;
  
  
            xLinearScale = xScale(stateData, chosenXAxis);
  
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  
            textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis);
          // updates tooltips with new info and assigns them true or false values
         
            circlesGroup = updateToolTip(chosenXAxis, circles);
            textcirclesGroup = updateToolTip(chosenXAxis, textCircles);
          
            if (chosenXAxis === "poverty") {
              inPoverty
                .classed("active", true)
                .classed("inactive", false);
              age
                .classed("active", false)
                .classed("inactive", true);
              householdIncome
                .classed("active", false)
                .classed("inactive", true);
            } 
            else if (chosenXAxis === "age") {
              inPoverty
                .classed("active", false)
                .classed("inactive", true);
              age
                .classed("active", true)
                .classed("inactive", false);
              householdIncome
                .classed("active", false)
                .classed("inactive", true);
            }
            else{
              inPoverty
                .classed("active", false)
                .classed("inactive", true);
              age
                .classed("active", false)
                .classed("inactive", true);
              householdIncome
                .classed("active", true)
                .classed("inactive", false);
            }
          
  
          }
        });
  
  }).catch(function(error) {
    console.log(error);
  });