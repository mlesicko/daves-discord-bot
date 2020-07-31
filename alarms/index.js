const genericAlarm = require('./genericAlarm.js');
const { withErrorLogging } = require('../errorLogging.js');

const alarms = [
	genericAlarm,
];

const start = (args) => {
	const { client } = args;
	alarms.forEach((alarm) =>
        client.setInterval(withErrorLogging(alarm.checkAlarm), alarm.interval, args)
	);
}

module.exports = {start};
