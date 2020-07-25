const genericAlarm = require('./genericAlarm.js');

const alarms = [
	genericAlarm,
];

const start = (args) => alarms.forEach((alarm) => alarm.start(args));

const stop = () => alarms.forEach((alarm) => alarm.stop());

module.exports = {start, stop};
