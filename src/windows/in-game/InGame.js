/*global overwolf*/

import React, { Component } from 'react';
import WindowNames from '../../common/constants/window-names';
import WindowsService from '../../common/services/windows-service';
import DragService from '../../common/services/drag-service';
import '../../common/style.css';
import Heatmap from '../../components/map/HeatMap';
import Navbar from '../../components/Navbar';
import mapInfo from '../../mapInfo';
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
      mapShow: false,
      phase: 'lobby',
      windowHeight: Math.floor(props.monitorHeight / 2),
      windowWidth: Math.floor(props.monitorWidth / 2),
      ...mapInfo['erangel']
    };
    this.db = this.props.iDb;
    this._eventListener = this._eventListener.bind(this);
    this._updateScreenshot = this._updateScreenshot.bind(this);
    this._updateHeatmap = this._updateHeatmap.bind(this);
    this.windowId = null;
    this.validPhases = ['lobby'];
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
      ...mapInfo['erangel']
    });
    console.log('db', this.db);
    console.log('phase', this.state.phase);
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
    WindowsService.minimize(WindowNames.IN_GAME);
    //WindowsService.hide(WindowNames.IN_GAME);
  }

  onCloseClicked(event) {
    this.state({
      mapShow: false
    });
    WindowsService.minimize(WindowNames.IN_GAME);
  }

  onSettingsClicked(event) {
    WindowsService.restore(WindowNames.SETTINGS);
  }

  onMapSelect = (eventKey, event) => {
    console.log(eventKey);
    if (mapInfo[eventKey] && mapInfo[eventKey].mapName !== this.state.mapName) {
      this.setState({ ...mapInfo[eventKey] });
    }
  };

  render() {
    console.log(this.state);
    const { windowHeight, windowWidth } = this.state;
    return (
      <div
        class={this.props.className}
        style={{ height: windowHeight, width: windowWidth }}
      >
        {/* 
				<svg xmlns='http://www.w3.org/2000/svg' display='none'>
					<symbol id='window-control_close' viewBox='0 0 30 30'>
						<line x1='19.5' y1='10.5' x2='10.5' y2='19.5' fill='none' stroke='currentcolor'
							strokeLinecap='round' />
						<line x1='10.5' y1='10.5' x2='19.5' y2='19.5' fill='none' stroke='currentcolor'
							strokeLinecap='round' />
					</symbol>
					<symbol id='window-control_settings' viewBox='0 0 30 30'>
						<path d='M22,16.3V13.7H19.81a4.94,4.94,0,0,0-.49-1.18L20.87,11,19,9.13l-1.55,1.55a5,5,0,0,0-1.18-.49V8H13.7v2.19a5,5,0,0,0-1.18.49L11,9.13,9.13,11l1.55,1.55a5,5,0,0,0-.49,1.18H8v2.6h2.19a5,5,0,0,0,.49,1.18L9.13,19,11,20.87l1.55-1.55a4.94,4.94,0,0,0,1.18.49V22h2.6V19.81a4.94,4.94,0,0,0,1.18-.49L19,20.87,20.87,19l-1.55-1.55a4.94,4.94,0,0,0,.49-1.18Zm-7,1.45A2.75,2.75,0,1,1,17.75,15,2.75,2.75,0,0,1,15,17.75Z'
							fill='currentcolor' />
					</symbol>
				</svg>
			*
				<header className="app-header" ref={this._headerRef}>
					<div className="window-controls-group">
						<button className="icon window-control" id="settingsButton" onClick={this.onSettingsClicked}>
							<svg>
								<use xlinkHref="#window-control_settings" />
							</svg>
						</button>
					</div>
				</header>
			*/}
        <Navbar
          onMapSelect={this.onMapSelect}
          headerRef={this._headerRef}
          dragService={this._dragService}
          width={this.state.windowWidth}
        />
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
        <div class="d3-container" ref={this._d3Ref}>
          <div id="d3-svg" />
        </div>
      </div>
    );
  }
}

export default InGame;
