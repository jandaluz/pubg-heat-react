/*global overwolf*/

import React, { Component } from 'react';
import Background from './windows/background/Background';
import Settings from './windows/settings/Settings';
import InGame from './windows/in-game/InGame';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentWindowName: ''
		};
	}

	componentDidMount() {
		overwolf.windows.getCurrentWindow(result => {
			this.setState({
				currentWindowName: result.window.name
			});
		});
	}

  render() {
		overwolf.log.info("rendering the OW App...");
		const windowName = this.state.currentWindowName;
		overwolf.log.info("current window name: " + windowName);
		let window;
		let body = document.getElementsByTagName('body')[0]
		switch (windowName) {
			case 'background':
				overwolf.log.info("Background");
				window = <Background />
				break;
			case 'settings':
				overwolf.log.info("Settings");
				window = <Settings />
				body.className = 'settings'
				break;
			case 'ingame':
				overwolf.log.info("In-Game");
				window = <InGame />
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
