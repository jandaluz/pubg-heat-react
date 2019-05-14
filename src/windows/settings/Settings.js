/*global overwolf*/

import React, { Component } from 'react';
import { HotkeysService, DragService } from '../../common/services';
import '../../common/style.css';

class Settings extends Component {
  constructor(props) {
    super(props);

    this._dragService = null;
    this._headerRef = React.createRef();

    this.state = {
      toggleText: '',
      heatmapText: ''
    };
  }

  async _updateHotkeys() {
    console.log('update hotkeys');
    let toggleHotkey = await HotkeysService.getToggleHotkey();
    let heatmapHotkey = await HotkeysService.getHeatMapHotkey();
    console.log(heatmapHotkey);
    this.updateToggle(toggleHotkey);
    this.updateHeatmap(heatmapHotkey);
  }

  async componentDidMount() {
    try {
      await this._updateHotkeys();
    } catch (e) {
      console.error(e);
    }

    HotkeysService.addHotkeyChangeListener(this._updateHotkeys);

    // Make window draggable
    overwolf.windows.getCurrentWindow(result => {
      this._dragService = new DragService(
        result.window,
        this._headerRef.current
      );
    });
  }

  onCloseClicked(event) {
    window.close();
  }

  updateToggle(value) {
    this.setState({
      toggleText: value
    });
  }

  updateHeatmap(value) {
    this.setState({
      heatmapText: value
    });
  }

  render() {
    return (
      <div className="settings">
        <h1>Welcome to PUBG: Hotdrops!</h1>
        <p>
          Squad can't decide where to drop? Find out where the hot zones are for
          each map and jump into the action
        </p>
        <section>
          <h3>How do I show/hide the Hotdrop heat map?</h3>
          <p>
            <span>You can toggle the heat map on and off using</span>
            <kbd id="heatmap">{this.state.heatmapText}</kbd>
          </p>
          <h3>How do I select a map?</h3>
          <p>
            It's easy! Hover your mouse over the top portion of the heat map to
            bring the map selection bar to the foreground
          </p>
          <h3>
            When does this Hotdrop heat map show? I don't want it in the way
            while I'm in game
          </h3>
          <p>
            The heat map is currently designed to only be in the foreground in
            the lobby; it should minimize itself once you enter the loading
            phase
          </p>
          <h3>
            I don't want this here, I want it over there! How do I drag the
            Hotdrop heat map?
          </h3>
          <p>
            Hover the mouse over the top portion of the map to illuminate the
            navbar; click in an empty space in the toolbar and drag it wherever
            you want
          </p>
        </section>
      </div>
    );
  }
}

export default Settings;
