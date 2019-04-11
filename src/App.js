import React, { Component } from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//import Erangel from './components/erangel/Erangel'
import Map from './components/map/Map';
import * as d3 from "d3"
import * as d3contours from "d3-contour"

class App extends Component {

  constructor(props) {
    super(props);


    this.state = {
      playerPositionX: 0,
      playerPositionY: 0,
      mapUrl: "",
      mapName: '',
      phase: 'lobby',
    }
  }
  componentDidMount() {
    //this.onMapSelect("erangel");
    this.readTheCsv();
  }
  render() {
    return (

      <div className="App" style={{ height: "1098px" }}>

        {
          this.state.phase === "lobby" ?
            <Navbar fixed="top" bg="dark" variant="dark">
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link eventKey="erangel" onSelect={this.onMapSelect}>Erangel</Nav.Link>
                  <Nav.Link eventKey="miramar" onSelect={this.onMapSelect}>Miramar</Nav.Link>
                  <Nav.Link eventKey="sanhok" onSelect={this.onMapSelect}>Sanhok</Nav.Link>
                  <Nav.Link eventKey="vikendi" onSelect={this.onMapSelect}>Vikendi</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            : null
        }

        {
          this.state.mapUrl !== "" ? (
            <Map mapClass={["bg", this.state.mapName]}></Map>
          ) : null
        }
        <div id="d3-svg"></div>
      </div>
    );
  }

  onMapSelect = (eventKey, event) => {
    console.log(eventKey)
    this.setState({
      mapName: eventKey
    });
    switch (eventKey) {
      case "erangel":
        this.setState({
          "mapUrl": "https://storage.googleapis.com/pubg-hackathon-plots/heatmap/Erangel_heat.png"
        });
        break;
      case "miramar":
        this.setState({
          "mapUrl": "https://storage.googleapis.com/pubg-hackathon-plots/heatmap/Miramar_heat.png"
        });
        break;
      case "sanhok":
        this.setState({
          "mapUrl": "https://storage.googleapis.com/pubg-hackathon-plots/heatmap/Sanhok_heat.png"
        });
        break;
      case "vikendi":
        this.setState({
          "mapUrl": "https://storage.googleapis.com/pubg-hackathon-plots/heatmap/Vikendi_heat.png"
        });
        break;
      default:
        this.setState({
          "mapUrl": ""
        });
        break;
    }
  }

  readTheCsv = () => {

    let height = 1098;
    let width = 1098;
    var svg = d3.select("#d3-svg")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")

    d3.csv("data/erangel.1.csv").then((data) => {
      const landingCoords = data.map((data) => {
        return {
          "x": (+data.landing_x) / 100,
          "y": (+data.landing_y) / 100
        }
      });
      console.log(landingCoords)

      var xScale = d3.scaleLinear()
        .domain([0, 8160])
        .range([0, width]);
      var yScale = d3.scaleLinear()
        .domain([0, 8160])
        .range([0, height])

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
      // Prepare a color palette

      var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateYlOrRd)
        .domain([0.1, 0])



      var myimage = svg.append('image')
        .attr('xlink:href', 'https://github.com/pubg/api-assets/raw/master/Assets/Maps/Erangel_Main_Low_Res.png')
        .attr('width', 1098)
        .attr('height', 1098)

      console.log(myimage);


      // Circles
      /**
      var circles = svg.selectAll('circle')
        .data(landingCoords)
        .enter()
        .append('circle')
        .attr('cx', function (d) { return xScale(d.x) })
        .attr('cy', function (d) { return yScale(d.y) })
        .attr('r', '2')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', function (d, i) { return i })
        .on('mouseover', function () {
          d3.select(this)
            .transition()
            .duration(500)
            .attr('r', 4)
            .attr('stroke-width', 3)
        })
      **/
      svg.insert("g")
        .selectAll("path")
        .data(contours)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("fill", function (d) { return myColor(d.value); })
        .attr("class", "contour")

      this.setState({
        data: data
      });
    });
  }
}

export default App;
