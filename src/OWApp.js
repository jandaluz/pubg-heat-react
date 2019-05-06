/*global overwolf*/

import React, { Component } from 'react';
import Background from './windows/background/Background';
import BackgroundController from './windows/background/BackgroundController';
import Settings from './windows/settings/Settings';
import InGame from './windows/in-game/InGame';
import IndexedDbService from './common/services/indexed-db-service';
import './App.css'

class App extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			currentWindowName: '',
			monitorHeight: 1098
		};

		this.db = null;
	}

	async componentDidMount() {
		this.db = await IndexedDbService.openDb('pubg-heat')
		console.log(this.db);
		const maps = await this.getMaps();
		for (var codeName in maps) {
			const refresh = await IndexedDbService.mapNeedsRefresh(this.db, codeName);
			if(refresh) {
				let tx = this.db.transaction("maps", 'readwrite');
				let store = tx.objectStore('maps');
				console.log(codeName, maps[codeName]);
				const map = maps[codeName];
				const d3MapImg = await BackgroundController._fetchMapImgBase64(map);
				console.log(d3MapImg);
				this.db.transaction("maps", 'readwrite')
					.objectStore('maps')
					.add({
						'codeName': codeName,
						'mapData': d3MapImg,
						'timestamp': new Date()
					});
			}
			else {
				console.log('no refresh needed; load images from indexedDb');
			}
		}

		overwolf.windows.getCurrentWindow(result => {
			this.setState({
				currentWindowName: result.window.name
			});
		});

		let monitorHeight = await BackgroundController._getActiveMonitorHeight();
		this.setState({
			monitorHeight: monitorHeight
		});

	}

	mapImageMapCallback = (mapImageMap) => {
		console.log('update state with map images', mapImageMap);
		this.setState({
			mapMap: mapImageMap
		});
	};

	async getMaps() {
		console.log('fetch map names from pubg github');
		const mapDictionaryUrl = "https://raw.githubusercontent.com/pubg/api-assets/master/dictionaries/telemetry/mapName.json";
		try {
			let response = await fetch(mapDictionaryUrl);
			return await response.json();
		} catch (err) {
			console.error('unable to download maps', err);
		}
	}

	render() {
		const windowName = this.state.currentWindowName;
		let window;
		let body = document.getElementsByTagName('body')[0]
		switch (windowName) {
			case 'background':
				window = <Background />
				break;
			case 'settings':
				window = <Settings />
				body.className = 'settings'
				break;
			case 'ingame':
				window = <InGame className="map"
					monitorHeight={this.state.monitorHeight}
					iDb={this.db} />
				body.className = 'in-game'
				break;
		}

		return (
			<div className="App">
				{window}
			</div>
		);
	}
}

export default App;
