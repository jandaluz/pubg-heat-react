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
      "domainX": props.domainX,
      "domainY": props.domainY,
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
      console.log(this.props);
      this.setState({
        "mapName": this.props.mapName,
        "mapUrl": this.props.mapUrl,
        "domainX": this.props.domainX,
        "domainY": this.props.domainY,
        "rangeX": this.props.rangeX,
        "rangeY" :this.props.rangeY
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

    let height = this.state.rangeY;
    let width = this.state.rangeX;
    var svg = d3.select("#d3-svg")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")

    const dataUrl = "https://storage.googleapis.com/pubg-hackathon-published/landings/" + this.props.mapName + ".csv";
    d3.csv(dataUrl).then((data) => {
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
        .domain([0, (+this.state.domainX)/100])
        .range([0, width]);
      var yScale = d3.scaleLinear()
        .domain([0, (+this.state.domainY)/100])
        .range([0, height])

      if (landingCoords.length > 0) {
        let contours = d3contours.contourDensity()
          .x((d) => {
            return xScale(d.x);
          })
          .y((d) => {
            return yScale(d.y);
          })
          .size([this.state.domainX/100, this.state.domainY/100])
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
          .attr('width', width)
          .attr('height', height)
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