import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeatMap from './components/map/HeatMap';
import mapInfo from './mapInfo';

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
    const { phase, mapName } = this.state;
    return (
      <div className="App" style={{ height: '1098px' }}>
        {phase === 'lobby' && <Navbar onMapSelect={this.onMapSelect} />}
        {mapName ? (
          <HeatMap
            mapName={this.state.mapName}
            mapUrl={this.state.mapUrl}
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
    this.setState(mapInfo[eventKey]);
  };
}

export default App;
