import React, { Component } from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//import Erangel from './components/erangel/Erangel'
import HeatMap from './components/map/HeatMap';
import * as d3 from "d3"

class App extends Component {

  constructor(props) {
    super(props);


    this.state = {
      playerPositionX: 0,
      playerPositionY: 0,
      phase: 'lobby',
      mapName: '',
      mapUrl: '',
    }
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
        { this.state.mapName !== '' ?
          <HeatMap
            mapName={this.state.mapName}
            mapUrl={this.state.mapUrlHighRes}
            rangeX={1098}
            rangeY={1098}
            domainX={this.state.domainX}
            domainY={this.state.domainY}>
          </HeatMap>
          : null
        }
    </div>

    )};

  componentDidMount = () => {

    const mapDictionaryUrl = "https://raw.githubusercontent.com/pubg/api-assets/master/dictionaries/telemetry/mapName.json";
    fetch(mapDictionaryUrl).then( (resp) => {
      resp.json();
    }).then( (json) => {
      this.setState({
        mapDictionary: json
      });
    });
  }
  
  onMapSelect = (eventKey, event) => {
    console.log(eventKey)
    switch (eventKey) {
      case "erangel":
        this.setState({
          "mapName": "Erangel_Main",
          "mapUrlLowRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Erangel_Main_Low_Res.png",
          "mapUrlHighRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Erangel_Main_High_Res.png",
          "domainX": 816000,
          "domainY": 816000,
        });
        break;
      case "miramar":
        this.setState({
          "mapName": "Desert_Main",
          "mapUrlLowRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Miramar_Main_Low_Res.png",
          "mapUrlHighRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Miramar_Main_High_Res.png",
          "domainX": 816000,
          "domainY": 816000,
        });
        break;
      case "sanhok":
        this.setState({
          "mapName": "Savage_Main",
          "mapUrlLowRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Sanhok_Main_Low_Res.png",
          "mapUrlHighRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Sanhok_Main_High_Res.png",
          "domainX": 408000,
          "domainY": 408000,
        });
        break;
      case "vikendi":
        this.setState({
          "mapName": "DihorOtok_Main",
          "mapUrlLowRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Vikendi_Main_Low_Res.png",
          "mapUrlHighRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Vikendi_Main_High_Res.png",
          "domainX": 612000,
          "domainY": 612000,
        });
        break;
      default:
        break;
    }
  }
}

export default App;
