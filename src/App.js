import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeatMap from './components/map/HeatMap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerPositionX: 0,
      playerPositionY: 0,
      phase: 'lobby',
      mapName: '',
      mapUrl: ''
    };
    this.onMapSelect = this.onMapSelect.bind(this);
  }

  render() {
    return (
      <div className="App" style={{ height: '1098px' }}>
        {this.state.phase === 'lobby' && (
          <Navbar onMapSelect={this.onMapSelect} />
        )}
        {this.state.mapName !== '' ? (
          <HeatMap
            mapName={this.state.mapName}
            mapUrl={this.state.mapUrlHighRes}
            rangeX={1098}
            rangeY={1098}
            domainX={this.state.domainX}
            domainY={this.state.domainY}
          />
        ) : null}
      </div>
    );
  }

  onMapSelect = (eventKey, event) => {
    console.log(eventKey);
    switch (eventKey) {
      case 'erangel':
        this.setState({
          mapName: 'Erangel_Main',
          mapUrlLowRes:
            'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png',
          mapUrlHighRes:
            'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_High_Res.png',
          domainX: 816000,
          domainY: 816000
        });
        break;
      case 'miramar':
        this.setState({
          mapName: 'Desert_Main',
          mapUrlLowRes:
            'https://raw.githubusercontent.com/pubg/api-assets//master/Assets/Maps/Miramar_Main_Low_Res.png',
          mapUrlHighRes:
            'https://raw.githubusercontent.com/pubg/api-assets//master/Assets/Maps/Miramar_Main_High_Res.png',
          domainX: 816000,
          domainY: 816000
        });
        break;
      case 'sanhok':
        this.setState({
          mapName: 'Savage_Main',
          mapUrlLowRes:
            'https://raw.githubusercontent.com/pubg/api-assets//master/Assets/Maps/Sanhok_Main_Low_Res.png',
          mapUrlHighRes:
            'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Sanhok_Main_High_Res.png',
          domainX: 408000,
          domainY: 408000
        });
        break;
      case 'vikendi':
        this.setState({
          mapName: 'DihorOtok_Main',
          mapUrlLowRes:
            'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Vikendi_Main_Low_Res.png',
          mapUrlHighRes:
            'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Vikendi_Main_High_Res.png',
          domainX: 612000,
          domainY: 612000
        });
        break;
      default:
        break;
    }
  };
}

export default App;
