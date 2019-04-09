import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
      phase: 'airfiled',
    }
  }
  componentDidMount() {
    this.onMapSelect("erangel");
    this.readTheCsv();
  }
  render() {
    return (

      <div className="App" style={{height: "1098px"}}>

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
            this.state.mapUrl != "" ? (
                  <Map mapClass={["bg", this.state.mapName]}></Map>
            ) : null
          }
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
    d3.csv("data/landings.csv").then( (data) => {
      console.log(data);
      const landingCoords = data.map( (data) => {
        return [data.landing_x, data.landing_y];
      })
      console.log(landingCoords)
      let contours = d3contours.contourDensity()
        .size([816000,816000])
        .x( (d) => {
          return d[0];
        })
        .y( (d) => {
          return d[1];
        })
        .cellSize(10);
      console.log(contours)
      this.setState({
        data: data
      });
    });
  }
}

export default App;
