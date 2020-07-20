const { objectMap, runAndSetInterval } = require('../utils.js');
const { withErrorLogging } = require('../errorLogging.js');

const second = 1000;
const minute = second * 60;
const alarmPaths = ['/events/']

let alarmInterval;

const start = (args) => {
	alarmInterval = runAndSetInterval(withErrorLogging(checkAlarms), minute, args);
}

const stop = () => {
	if (alarmInterval != undefined) {
		clearInterval(alarmInterval);
	}
	alarmInterval = undefined;
}

const checkAlarms = ({client, db}) => {
	alarmPaths.forEach((path) => checkAlarmsInPath(client, db, path));
}

const checkAlarmsInPath = (client, db, path) => {
	const now = Date.now();
	const alarmsObject = objectMap(getAlarms(db, path), (channel, alarms) => {
		const pendingAlarms = [];
		alarms.forEach((alarm) => {
			if (alarm.time <= now) {
				triggerAlarm(client, channel, alarm);
			} else {
				pendingAlarms.push(alarm);
			}
		})
		return pendingAlarms;
	});
	updateAlarms(db, alarmsObject, path);
}

const getAlarms = (db, path) => {
	return db.getData(path);
}

const updateAlarms = (db, alarmsObject, path) => {
	db.push(path, alarmsObject, true);
}

const triggerAlarm = (client, channelId, alarm) => {
	client.channels.find(
		(channel) => channel.id === channelId
	).send(alarm.prefix + alarm.message);
}

module.exports={start, stop};
