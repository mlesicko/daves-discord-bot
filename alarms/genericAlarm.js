const { objectMap, runAndSetInterval } = require('../utils.js');
const { withErrorLogging } = require('../errorLogging.js');

const second = 1000;
const minute = second * 60;
const alarmPaths = ['/events/']

const interval = minute;

const checkAlarm = ({client, db}) => {
	alarmPaths.forEach((path) => checkAlarmsInPath(client, db, path));
}

const checkAlarmsInPath = async (client, db, path) => {
	const now = Date.now();
	const alarmsObject = objectMap(await getAlarms(db, path), (channel, alarms) => {
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

const getAlarms = async (db, path) => {
	return await db.getData(path);
}

const updateAlarms = (db, alarmsObject, path) => {
	db.push(path, alarmsObject, true);
}

const triggerAlarm = (client, channelId, alarm) => {
	client.channels.fetch(channelId)
		.then((channel) => channel.send(alarm.prefix + alarm.message));
}

module.exports={checkAlarm, interval};
