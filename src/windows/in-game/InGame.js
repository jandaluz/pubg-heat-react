/*global overwolf*/

import React, { Component } from 'react';
import { WindowNames, MapInfo } from '../../common/constants';
import { WindowsService, DragService } from '../../common/services';
import { Heatmap, Navbar } from '../../components/';
import '../../common/style.css';
import '../../App.css';

class InGame extends Component {
  constructor(props) {
    super(props);

    this._dragService = null;
    this._headerRef = React.createRef();
    this._d3Ref = React.createRef();

    this.state = {
      imgSrc: null,
      mapUrl: '',
      mapShow: true,
      phase: 'lobby',
      windowHeight: Math.floor(props.monitorHeight / 2), //height should be half of the monitor resolution
      windowWidth: Math.floor(props.monitorHeight / 2), //width should match height to be a square
      ...MapInfo['erangel']
    };
    this.db = this.props.iDb;
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this._eventListener = this._eventListener.bind(this);
    this._updateScreenshot = this._updateScreenshot.bind(this);
    this._updateHeatmap = this._updateHeatmap.bind(this);
    this.windowId = null;
    this.validPhases = ['lobby', 'airfield', 'aircraft'];
    overwolf.windows.getCurrentWindow(result => {
      this._dragService = new DragService(
        result.window,
        this._headerRef.current
      );
    });
  }

  async componentDidMount() {
    let mainWindow = overwolf.windows.getMainWindow();
    mainWindow.ow_eventBus.addListener(this._eventListener);

    this.setState({
      ...MapInfo['erangel']
    });
    console.log('db', this.db);
    console.log('phase', this.state.phase);

    overwolf.windows.getCurrentWindow(result => {
      let owWindow = result.window;
      this.adjustWindowSize(owWindow).then(wResult => {
        console.log(wResult);
      });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.phase !== this.state.phase &&
      !this.validPhases.includes(this.state.phase)
    ) {
      this._hideHeatmap();
    } else if (
      this.validPhases.includes(this.state.phase) &&
      this.state.mapShow
    ) {
      this._updateHeatmap();
    }
  }

  componentShouldUpdate(nextProps, nextState) {
    if(nextState.mapName === this.state.mapName && nextState.mapShow === this.state.mapShow) {
      return false;
    }
    
    return true;
  }
  _eventListener(eventName, data) {
    switch (eventName) {
      case 'heatmap': {
        console.log('heatmap event');
        if (
          !this.state.mapShow &&
          this.validPhases.includes(this.state.phase)
        ) {
          this._updateHeatmap();
          this.setState({
            mapShow: !this.state.mapShow
          });
        } else if (
          this.state.mapShow &&
          this.validPhases.includes(this.state.phase)
        ) {
          this._hideHeatmap();
          this.setState({
            mapShow: !this.state.mapShow
          });
        }
        break;
      }
      case 'phase': {
        const phase = data;
        console.log('phase change detected', phase);
        this.setState({
          phase: phase
        });
        break;
      }
      case 'map': {
        const mapName = data;
        console.log('map change detected', mapName);        
        break;
      }
      default:
        console.log(eventName);
        console.log(data);
        console.log(JSON.stringify(data));
        break;
    }
  }

  _updateScreenshot(url) {
    WindowsService.restore(WindowNames.IN_GAME);
    this.setState({ imgSrc: url });
  }

  async _updateHeatmap() {
    console.log('show heatmap');
    if (this.validPhases.includes(this.state.phase)) {
      await WindowsService.restore(WindowNames.IN_GAME);
    } else {
      console.log("don't show hetmap, invalid phase", this.state.phase);
    }
  }

  _hideHeatmap() {
    console.log('hide heatmap');
    //WindowsService.minimize(WindowNames.IN_GAME);
    WindowsService.hide(WindowNames.IN_GAME);
  }

  async onCloseClicked(event) {
    await WindowsService.minimize(WindowNames.IN_GAME);
    this.setState({
      mapShow: false
    });
  }

  onSettingsClicked(event) {
    WindowsService.restore(WindowNames.SETTINGS);
  }

  onMapSelect = (eventKey, event) => {
    console.log(eventKey);
    if (MapInfo[eventKey] && MapInfo[eventKey].mapName !== this.state.mapName) {
      this.setState({ ...MapInfo[eventKey] });
    }
  };

  adjustWindowSize = window => {
    console.log('adjusting the window size...');
    const height = this.state.windowHeight;
    const width = this.state.windowWidth;
    const borderSize = 4;
    return new Promise((resolve, reject) => {
      overwolf.windows.changeSize(
        window.id,
        width + borderSize,
        height + borderSize,
        res => {
          if (res.status === 'success') {
            console.log('window size adjusted', height, width);
            this.setState(
              {
                windowHeight: height,
                windowWidth: width
              },
              () => {
                resolve(res.status);
              }
            );
          } else {
            reject(res.status);
          }
        }
      );
    });
  };

  render() {
    console.log(this.state);
    const { windowHeight, windowWidth } = this.state;
    return (
      <div class={this.props.className}>
        {this.state.mapShow ? (
          <Navbar
            onMapSelect={this.onMapSelect}
            headerRef={this._headerRef}
            dragService={this._dragService}
            width={this.state.windowWidth}
            onClose={this.onCloseClicked}
          />
        ) : null}
        {this.state.mapShow ? (
          <Heatmap
            mapName={this.state.mapName}
            mapUrl={this.state.mapUrl}
            rangeX={windowWidth}
            rangeY={windowHeight}
            domainX={this.state.domainX}
            domainY={this.state.domainY}
            iDb={this.db}
            phase={this.state.phase ? this.state.phase : 'lobby'}
          />
        ) : null}
        <div class="d3-container" ref={this._d3Ref}>
          <div id="d3-svg" />
        </div>
      </div>
    );
  }
}

export default InGame;
