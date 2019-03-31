import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//import Erangel from './components/erangel/Erangel'
import Map from './components/map/Map';

class App extends Component {

  constructor(props) {
    super(props);


    this.state = {
      playerPositionX: 0,
      playerPositionY: 0,
      mapUrl: "",
    }    
  }
  render() {
    return (
      <div className="App">
        <Navbar fixed="top" bg="light">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link eventKey="erangel" onSelect={this.onMapSelect}>Erangel</Nav.Link>
              <Nav.Link eventKey="miramar" onSelect={this.onMapSelect}>Miramar</Nav.Link>
              <Nav.Link eventKey="sanhok" onSelect={this.onMapSelect}>Sanhok</Nav.Link>
              <Nav.Link eventKey="vikendi" onSelect={this.onMapSelect}>Vikendi</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {
          this.state.mapUrl != "" ? (
            <Map mapUrl={this.state.mapUrl}></Map>
          ) : null
        }
      </div>
    );
  }

  onMapSelect = (eventKey,event) => {
    console.log(eventKey)
    switch(eventKey) {
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
}

export default App;
