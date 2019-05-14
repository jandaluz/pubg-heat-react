/*global overwolf*/

import screenshotService from './screenshots-service';

const REQUIRED_FEATURES = ['kill','match','phase', 'map', 'me'];
const REGISTER_RETRY_TIMEOUT = 10000;

function registerToGEP() {
	overwolf.games.events.setRequiredFeatures(REQUIRED_FEATURES, function (response) {
		if (response.status === 'error') {
			setTimeout(registerToGEP, REGISTER_RETRY_TIMEOUT);
		} else if (response.status === 'success') {
			overwolf.games.events.onNewEvents.removeListener(_handleGameEvent);
			overwolf.games.events.onNewEvents.addListener(_handleGameEvent);
			overwolf.games.events.onInfoUpdates2.removeListener(_handleInfoEvent);
			overwolf.games.events.onInfoUpdates2.addListener(_handleInfoEvent);
			//overwolf.games.inputTracking.onKeyDown.removeListener(_handleKeyEvent);
			//overwolf.games.inputTracking.onKeyDown.addListener(_handleKeyEvent);
		}
	});
}

async function _handleGameEvent(eventsInfo) {
	for (let eventData of eventsInfo.info) {
		switch (eventData.name) {
			case 'kill': {
				try {
					console.log('nice shot bud');
					//let screenshotUrl = await screenshotService.takeScreenshot();
					//window.ow_eventBus.trigger('screenshot', screenshotUrl);
				} catch (e) {
					console.error(e);
				}

				break;
			}
			case 'match': {
				console.log("match event");
				console.log(eventData);
				window.ow_eventBus.trigger('match', eventData);
				break;
			}
			case 'phase': {
				console.log('phase event', eventData);
				console.log(eventData);
				window.ow_eventBus.trigger('phase', eventData);
				break;
			}
			case 'map': {
				console.log('map event', eventData);
				window.ow_eventBus.trigger('map', eventData);
			}
			default:
				console.log(eventData);
				console.log(JSON.stringify(eventData));
				break;
		}
	}
}

async function _handleInfoEvent(infoEvent) {
	overwolf.log.info('infoEvent');
	console.log('_handleInfoEvent', infoEvent);
	overwolf.log.info(JSON.stringify(infoEvent));
	switch(infoEvent.feature) {
		case 'phase': {
			const phase = infoEvent.info.game_info.phase
			window.ow_eventBus.trigger('phase', phase);
			break;
		}
		case 'map': {
			const map = infoEvent.info.match_info.map;
			window.ow_eventBus.trigger('map', map);
			break;
		}
		default: {
			console.log('unhandled features', infoEvent.feature);
		}
	}
	
}

async function _handleKeyEvent(eventInfo) {
	console.log(eventInfo);
	console.log('keyEvent', eventInfo.key);
	console.log('onGame', eventInfo.onGame);
	window.ow_eventBus.trigger('keyPress', eventInfo.key);
}

export default {
	registerToGEP
}