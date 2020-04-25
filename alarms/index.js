const genericAlarm = require('./genericAlarm.js');

const alarms = [
	genericAlarm
];

const start = (client, db) => alarms.forEach((alarm) => alarm.start(client, db));

const stop = () => alarms.forEach((alarm) => alarm.stop());

module.exports = {start, stop};
