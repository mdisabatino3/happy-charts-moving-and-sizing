import * as d3 from "d3";

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const initContainerWidth = 960;
const initContainerHeight = 500;
const initWidth = initContainerWidth - margin.left - margin.right;
const initHeight = initContainerHeight - margin.top - margin.bottom;
const initPosX = 20;
const initPosY = 100;

d3.select(".chart-container")
  .style("width", initContainerWidth + "px")
  .style("height", initContainerHeight + "px")
  .style("left", initPosX + "px")
  .style("top", initPosY + "px")
  .style("position", "relative")
  .style("border", "2px solid")
  .style("padding", "20px");
// function for getting correct time format
const parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, initWidth]);
var y = d3.scaleLinear().range([initHeight, 0]);

var xAxis = d3.axisBottom(x).ticks(5);
var yAxis = d3.axisLeft(y).ticks(5);

// define the line
var valueline = d3
  .line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.close);
  });

var svg = d3
  .select(".chart-container")
  .append("svg")
  .attr("width", initContainerWidth + "px")
  .attr("height", initContainerHeight + "px")
  .attr("class", "canvas")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("src/data.csv").then(function(data) {
  console.log(data);
  data.forEach(d => {
    d.date = parseTime(d.date);
    d.close = +d.close;
  });
  // Scale the range of the data
  x.domain(
    d3.extent(data, function(d) {
      return d.date;
    })
  );
  y.domain([
    0,
    d3.max(data, function(d) {
      return d.close;
    })
  ]);

  // Add the valueline path.
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)
    .style("fill", "none")
    .style("stroke-width", "2px")
    .style("stroke", "steelblue");

  // Add the X Axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + initHeight + ")")
    .call(xAxis);

  // Add the Y Axis
  svg
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis);
});

function makeResizeableDiv(containerDiv, resizeFunc) {
  const div = d3.select(containerDiv);
  div
    .append("svg")
    .on("mousedown", function() {
      var widthStart = parseFloat(d3.select(containerDiv).style("width"));
      var heightStart = parseFloat(d3.select(containerDiv).style("height"));
      var startPos = d3.mouse(d3.select("body").node());
      var deltaX;
      var deltaY;
      var window = d3
        .select("body")
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);
      function mousemove() {
        var newPos = d3.mouse(this);
        deltaX = newPos[0] - startPos[0];
        deltaY = newPos[1] - startPos[1];
        d3.select(containerDiv).style("width", widthStart + deltaX + "px");
        d3.select(containerDiv).style("height", heightStart + deltaY + "px");
        resizeFunc(containerDiv);
      }
      function mouseup() {
        window.on("mousemove", null);
        window.on("mouseup", null);
      }
    })
    .style("position", "absolute")
    .style("bottom", "0")
    .style("right", "0")
    .style("cursor", "nwse-resize")
    .style("width", "16")
    .style("height", "16")
    .style("viewBox", "0 0 16 16")
    .append("path")
    .attr(
      "d",
      "M19.51 3.08L3.08 19.51c.09.34.27.65.51.9.25.24.56.42.9.51L20.93 4.49c-.19-.69-.73-1.23-1.42-1.41zM11.88 3L3 11.88v2.83L14.71 3h-2.83zM5 3c-1.1 0-2 .9-2 2v2l4-4H5zm14 18c.55 0 1.05-.22 1.41-.59.37-.36.59-.86.59-1.41v-2l-4 4h2zm-9.71 0h2.83L21 12.12V9.29L9.29 21z"
    );
}

function makeMoveableDiv(containerDiv) {
  const div = d3.select(containerDiv);
  div
    .append("svg")
    .on("mousedown", function() {
      var left = parseFloat(d3.select(containerDiv).style("left"));
      var top = parseFloat(d3.select(containerDiv).style("top"));
      var startPos = d3.mouse(d3.select("body").node());
      var deltaX;
      var deltaY;
      var window = d3
        .select("body")
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);
      function mousemove() {
        var newPos = d3.mouse(this);
        deltaX = newPos[0] - startPos[0];
        deltaY = newPos[1] - startPos[1];
        d3.select(containerDiv).style("left", left + deltaX + "px");
        d3.select(containerDiv).style("top", top + deltaY + "px");
      }
      function mouseup() {
        window.on("mousemove", null);
        window.on("mouseup", null);
      }
    })
    .style("position", "absolute")
    .style("top", "0")
    .style("left", "50%")
    .style("transform", "translate(-12px,0px)")
    .style("width", "24px")
    .style("height", "24px")
    .style("cursor", "move")
    .style("viewBox", "0 0 24 24")
    .append("path")
    .attr("d", "M20 9H4v2h16V9zM4 15h16v-2H4v2z");
}

function resize(containerDiv) {
  // get new heights for svg chart
  var newContainerWidth = parseFloat(d3.select(containerDiv).style("width"));
  var newGraphWidth = newContainerWidth - margin.left - margin.right;
  var newContainerHeight = parseFloat(d3.select(containerDiv).style("height"));
  var newGraphHeight = newContainerHeight - margin.top - margin.bottom;
  d3.select(".canvas")
    .attr("width", newContainerWidth + "px")
    .attr("height", newContainerHeight + "px");

  x.range([0, newGraphWidth]);
  y.range([newGraphHeight, 0]);

  svg
    .select(".x-axis")
    .attr("transform", "translate(0," + newGraphHeight + ")")
    .call(xAxis);
  svg.select(".y-axis").call(yAxis);

  svg.selectAll(".line").attr("d", valueline);
}

makeResizeableDiv(".chart-container", resize);
makeMoveableDiv(".chart-container");
