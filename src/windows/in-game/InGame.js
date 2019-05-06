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

		console.log(props);
		this._dragService = null;
		this._headerRef = React.createRef();

		this.state = {
			imgSrc: null,
			mapUrl: '',
			mapShow: false,
			phase: "lobby",
			mapName: "",
			dataUrl: "",
		}
		this.db = this.props.iDb;
		this._eventListener = this._eventListener.bind(this);
		this._updateScreenshot = this._updateScreenshot.bind(this);
		this._updateHeatmap = this._updateHeatmap.bind(this);
	}

	async componentDidMount() {
		let mainWindow = overwolf.windows.getMainWindow();
		mainWindow.ow_eventBus.addListener(this._eventListener);

		// Make window draggable
		overwolf.windows.getCurrentWindow(result => {
			this._dragService = new DragService(result.window, this._headerRef.current)
			result.window.ow_eventBus.addListener(this._eventListener);
		})
		
		this.setState({
			"mapName": "Erangel_Main",
			"mapUrlLowRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Erangel_Main_Low_Res.png",
			"mapUrlHighRes": "https://github.com/pubg/api-assets/raw/master/Assets/Maps/Erangel_Main_High_Res.png",
			"domainX": 816000,
			"domainY": 816000,
		  });
		  console.log('db', this.db);
	}

	_eventListener(eventName, data) {
		switch (eventName) {
			case 'screenshot': {
				this._updateScreenshot(data);
				break;
			}
			case 'heatmap': {
				console.log('heatmap event')
				if(!this.state.mapShow){
					try {
						overwolf.games.events.getInfo((info) => {
							console.log(info);
							const phase = info.res.game_info.phase;
							console.log("phase: ", phase)
							this.setState({								
								phase: phase
							})
							if(info.res.match_info && info.res.match_info.map) {
								this._updateHeatmap(info.res.match_info.map);
							} else {
								this._updateHeatmap(this.state.mapName);
							}
						});
						console.log(this.state);
					}
					catch(error) {
						console.log(error);
						this._updateHeatmap(this.state.mapName);
					}
				} else {
					this._hideHeatmap()
				}
				this.setState({
					mapShow: !this.state.mapShow
				});
				break;
			}
			default:
				break;
		}
	}

	_updateScreenshot(url) {
		WindowsService.restore(WindowNames.IN_GAME);
		this.setState({ imgSrc: url })
	}

	_updateHeatmap(mapName) {
		console.log('show heatmap');
		WindowsService.restore(WindowNames.IN_GAME);
		this.onMapSelect(mapName);
	}

	_hideHeatmap() {
		console.log('hide heatmap');
		WindowsService.minimize(WindowNames.IN_GAME);
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
		if(mapInfo[eventKey] && mapInfo[eventKey].mapName !== this.state.mapName) {
			this.setState({...mapInfo[eventKey]});
		}
	  };

	render() {
		console.log(this.state);
		return (
			<div class={this.props.className} style={{ height: this.state.mapHeight }}>
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
				{this.state.phase == "lobby" ?
					<Navbar onMapSelect={this.onMapSelect}>
					</Navbar>
					: null
				}
				<Heatmap
					mapName={this.state.mapName}
					mapUrl={this.state.mapUrl}
					rangeX={this.props.monitorHeight}
					rangeY={this.props.monitorHeight}
					domainX={this.state.domainX}
					domainY={this.state.domainY}
					iDb={this.db}>
				</Heatmap>
				<div>
          			<div id="d3-svg" />
        		</div>

			</div>
		);
	}
}

export default InGame;