/*global overwolf*/

import React, { Component } from 'react';
import { Background, BackgroundController, Settings, InGame } from './windows';
import { IndexedDbService } from './common/services';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWindowName: '',
      monitorHeight: 0,
      monitorWidth: 0
    };

    this.db = null;
  }

  async componentDidMount() {
    this.db = await IndexedDbService.openDb('pubg-heat');
    console.log(this.db);
    const maps = await this.getMaps();
    for (var codeName in maps) {
      const refresh = await IndexedDbService.mapNeedsRefresh(this.db, codeName);
      if (refresh) {
        console.log(codeName, 'needs refresh');
        let tx = this.db.transaction('maps', 'readwrite');
        let store = tx.objectStore('maps');
        console.log(codeName, maps[codeName]);
        const map = maps[codeName];
        const d3MapImg = await BackgroundController._fetchMapImgBase64(map);
        console.log(d3MapImg);
        this.db
          .transaction('maps', 'readwrite')
          .objectStore('maps')
          .put({
            codeName: codeName,
            mapData: d3MapImg,
            timestamp: new Date()
          });
      } else {
        console.log('no refresh needed; load images from indexedDb');
      }
    }

    overwolf.windows.getCurrentWindow(result => {
      this.setState({
        currentWindowName: result.window.name
      });
    });

    //let monitorHeight = await BackgroundController._getActiveMonitorHeight();
    await this.setMonitorDimensions();
    console.log('OWAPP STATE');
    for (let key in this.state) {
      console.log(key);
      console.log(this.state[key]);
    }
  }

  setMonitorDimensions = async () => {
    let {
      monitorHeight,
      monitorWidth
    } = await BackgroundController._getActiveMonitorDimensions();
    this.setState({ monitorHeight, monitorWidth });
  };

  mapImageMapCallback = mapImageMap => {
    console.log('update state with map images', mapImageMap);
    this.setState({
      mapMap: mapImageMap
    });
  };

  async getMaps() {
    console.log('fetch map names from pubg github');
    const mapDictionaryUrl =
      'https://raw.githubusercontent.com/pubg/api-assets/master/dictionaries/telemetry/mapName.json';
    try {
      let response = await fetch(mapDictionaryUrl);
      return await response.json();
    } catch (err) {
      console.error('unable to download maps', err);
    }
  }

  render() {
    const { currentWindowName, monitorHeight, monitorWidth } = this.state;
    console.log('OWAPP RENDER');

    let window;
    let body = document.getElementsByTagName('body')[0];
    switch (currentWindowName) {
      case 'background':
        window = <Background />;
        break;
      case 'settings':
        window = <Settings />;
        body.className = 'settings';
        break;
      case 'ingame':
        if (monitorHeight && monitorWidth) {
          window = (
            <InGame
              className="map"
              monitorHeight={monitorHeight}
              monitorWidth={monitorWidth}
              iDb={this.db}
            />
          );
          body.className = 'in-game';
        }
        break;
      default:
        break;
    }

    return <div className="App">{window}</div>;
  }
}

export default App;
