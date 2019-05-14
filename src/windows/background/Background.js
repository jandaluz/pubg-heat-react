import React, { Component } from 'react';
import BackgroundController from './BackgroundController';

class Background extends Component {
	componentDidMount() {
    console.log("background did mount")
		BackgroundController.run();
	}

  render() {
    return (
      <div className="Background">
      </div>
    );
  }
}

export default Background;