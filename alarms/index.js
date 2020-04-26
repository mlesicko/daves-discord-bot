const genericAlarm = require('./genericAlarm.js');
const minecraft = require('./minecraft.js');

const alarms = [
	genericAlarm,
	minecraft
];

const start = (args) => alarms.forEach((alarm) => alarm.start(args));

const stop = () => alarms.forEach((alarm) => alarm.stop());

module.exports = {start, stop};
