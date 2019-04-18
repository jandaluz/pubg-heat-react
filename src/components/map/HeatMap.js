import React, { Component } from 'react';
import * as d3 from "d3";
import * as d3contours from "d3-contour";

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "mapName": props.mapName,
      "mapUrl": props.mapUrl,
      "rangeX": props.rangeX,
      "rangeY": props.rangeY,
    };
  }
  render = () => (
    <div>
      <div id="d3-svg"></div>
    </div>
  )

  componentDidMount = () => {
    console.log("componentDidMount");
    this.loadTheMap();
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (prevProps.mapName !== this.props.mapName &&
      prevProps.mapUrl !== this.props.mapUrl) {
      console.log(this.props.mapName);
      console.log(this.props.mapUrl);
      this.setState({
        "mapName": this.props.mapName,
        "mapUrl": this.props.mapUrl,
      });
      this.loadTheMap();
      return true;
    }
  }
  loadTheMap = () => {
    this.clearTheImage();
    if (this.state.mapName !== "") {
      this.readTheCsv();
    }
  }

  clearTheImage = () => {
    var svg = d3.select("#d3-svg")
    svg.selectAll("*").remove();
  }
  readTheCsv = () => {

    let height = 1098;
    let width = 1098;
    var svg = d3.select("#d3-svg")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")

    d3.csv("data/landings_subset.csv").then((data) => {
      const landingCoords = data.filter((data) => {
        return data.map_name === this.state.mapName;
      }).map((data) => {
        return {
          "x": (+data.x) / 100,
          "y": (+data.y) / 100
        }
      });
      console.log(this.state.mapName);
      console.log(landingCoords)

      var xScale = d3.scaleLinear()
        .domain([0, 8160])
        .range([0, this.state.rangeX]);
      var yScale = d3.scaleLinear()
        .domain([0, 8160])
        .range([0, this.state.rangeY])

      if (landingCoords.length > 0) {
        let contours = d3contours.contourDensity()
          .x((d) => {
            return xScale(d.x);
          })
          .y((d) => {
            return yScale(d.y);
          })
          .size([8160, 8160])
          .cellSize(8)
          (landingCoords);

        console.log(contours)
        const lastContour = contours[contours.length - 1].value;
        console.log(lastContour);
        let maxDomain = lastContour;

        // Prepare a color palette
        var myColor = d3.scaleSequential()
          .interpolator(d3.interpolateYlOrRd)
          .domain([0, maxDomain])

        d3.interpolateYlOrRd()


        var myimage = svg.append('image')
          .attr('xlink:href', this.state.mapUrl)
          .attr('width', this.state.rangeX)
          .attr('height', this.state.rangeY)
        console.log("img");
        console.log(myimage);

        svg.insert("g")
          .selectAll("path")
          .data(contours)
          .join("path")
          .attr("d", d3.geoPath())
          .attr("fill", function (d) { return myColor(d.value); })
          .attr("class", "contour")
      }
    });
  }
}
export default HeatMap;