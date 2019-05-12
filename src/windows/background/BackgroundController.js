/*global overwolf*/

import WindowNames from '../../common/constants/window-names';
import RunningGameService from '../../common/services/running-game-service';
import WindowsService from '../../common/services/windows-service';
import HotkeysService from '../../common/services/hotkeys-service';
import GEPService from '../../common/services/gep-service';
import EventBus from '../../common/services/event-bus';
import * as d3 from "d3";

class BackgroundController {
	static async run() {
		overwolf.log.info("Launching background controller...")
		window.ow_eventBus = EventBus;

		BackgroundController._registerAppLaunchTriggerHandler();
		BackgroundController._registerHotkeys();
		
		let startupWindow = await WindowsService.getStartupWindowName();
		WindowsService.restore(startupWindow);

		let isGameRunning = RunningGameService.isGameRunning();
		overwolf.log.info('isGameRunning? ' + isGameRunning)
		if (isGameRunning) {
			GEPService.registerToGEP();
			await WindowsService.restore(WindowNames.IN_GAME);
			WindowsService.minimize(WindowNames.IN_GAME);
		}

		RunningGameService.addGameRunningChangedListener((isGameRunning) => {
			if (isGameRunning) {
				WindowsService.restore(WindowNames.IN_GAME);
			} else {
				// WindowsService.minimize(WindowNames.IN_GAME);
				console.log('closing app after game closed');
				window.close();
			}
		});
	}

	static _registerAppLaunchTriggerHandler() {
		overwolf.extensions.onAppLaunchTriggered.removeListener(
			BackgroundController._onAppRelaunch);
		overwolf.extensions.onAppLaunchTriggered.addListener(
			BackgroundController._onAppRelaunch);
	}

	static _onAppRelaunch() {
		WindowsService.restore(WindowNames.SETTINGS);
	}

	static _registerHotkeys() {
		HotkeysService.setHeatMapHotkey(async () => {
			try {
				window.ow_eventBus.trigger('heatmap')
			} catch (e) {
				console.error(e);
			}
		});
	}

	static async _fetchMapImgBase64(mapName) {
		var svg = d3.select("#d3-img")
		console.log(mapName);
		const mapUrlHiRes = "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/"+mapName.replace(" ", "_")+"_Main_High_Res.png";		
		const mapUrlLowRes = "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/"+mapName.replace(" ", "_")+"_Main_Low_Res.png"
		let ret = {map: mapName};
		//for(let mapUrl of [mapUrlHiRes, mapUrlLowRes] ) {
		const img = await fetch(mapUrlLowRes, {cache: "default"});
		console.log(img);
		const mapBlob = await img.blob();
		return await BackgroundController._readMapBlob(mapBlob);		
	}

	static async _getActiveMonitorHeight() {
		return new Promise( (resolve, reject) => {
			overwolf.utils.getMonitorsList( (monitorsList) => {
				const displays = monitorsList.displays;
				let height = displays.filter( display => display.is_primary)
					.map( display => display.height)
					.reduce( (acc, curVal) => acc += curVal);
				return resolve(height);
			});
		});
	}

	static async _getActiveMonitorDimensions() {
		return new Promise( (resolve, reject) => {
			overwolf.utils.getMonitorsList( (monitorsList) => {
				const displays = monitorsList.displays;
				let dims = displays.filter( display => display.is_primary)
					.map( display => ({
						'height': parseInt(display.height), 'width': parseInt(display.width)
					}));
				return resolve(dims);
			});
		});
	}	

	static _readMapBlob(mapBlob) {
		const reader = new FileReader();
		reader.readAsDataURL(mapBlob);
		return new Promise( (resolve, reject) => {
			reader.onerror = () => {
				reader.abort();
				reject(new DOMException("problem parsing map blob"))
			}
			reader.onload = () => {
				resolve(reader.result);
			}
		});

	}
}

export default BackgroundController;