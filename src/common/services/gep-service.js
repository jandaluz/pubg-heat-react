/*global overwolf*/

import screenshotService from './screenshots-service';

const REQUIRED_FEATURES = ['kill'];
const REGISTER_RETRY_TIMEOUT = 10000;

function registerToGEP() {
	overwolf.games.events.setRequiredFeatures(REQUIRED_FEATURES, function (response) {
		if (response.status === 'error') {
			setTimeout(registerToGEP, REGISTER_RETRY_TIMEOUT);
		} else if (response.status === 'success') {
			overwolf.games.events.onNewEvents.removeListener(_handleGameEvent);
			overwolf.games.events.onNewEvents.addListener(_handleGameEvent);
			overwolf.games.events.onInfoUpdates2.addListener(_handleInfoEvent);
		}
	});
}

async function _handleGameEvent(eventsInfo) {
	for (let eventData of eventsInfo.info) {
		overwolf.log.info(eventData);
		switch (eventData.name) {
			case 'kill': {
				try {
					overwolf.log.info('nice shot bud');
					//let screenshotUrl = await screenshotService.takeScreenshot();
					//window.ow_eventBus.trigger('screenshot', screenshotUrl);
				} catch (e) {
					console.error(e);
				}

				break;
			}
		}
	}
}

async function _handleInfoEvent(eventsInfo) {
	overwolf.log.info(eventsInfo);
}

export default {
	registerToGEP
}