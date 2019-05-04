/*global overwolf*/

import React, { Component } from 'react';
import Background from './windows/background/Background';
import Settings from './windows/settings/Settings';
import InGame from './windows/in-game/InGame';
import './App.css'

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentWindowName: '',
			monitorHeight: 1098
		};
	}

	componentDidMount() {
		overwolf.windows.getCurrentWindow(result => {
			this.setState({
				currentWindowName: result.window.name
			});
		});
	}

	monitorHeightCallback(monitorHeight) {
		this.setState({
			monitorHeight: monitorHeight
		});
	}
  render() {
		const windowName = this.state.currentWindowName;
		let window;
		let body = document.getElementsByTagName('body')[0]
		switch (windowName) {
			case 'background':
				window = <Background monitorHeightCallback={this.monitorHeightCallback}/>
				break;
			case 'settings':
				window = <Settings />
				body.className = 'settings'
				break;
			case 'ingame':
				window = <InGame className="map" monitorHeight={this.state.monitorHeight}/>
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
