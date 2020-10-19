const genericAlarm = require('./genericAlarm.js');
const { withErrorLogging } = require('../errorLogging.js');

/**
* Alarms are for anything that needs to be triggered based on anything other
* than messages in Discord.
*
* This could be things that need to be done at a specified time, things that
* need to be done in response to events on the local machine, or things that
* need to be done based on anything else going on in the world, apart from
* Discord.
*
* Each alarm will manage what triggers it on its own with its checkAlarm
* function, and the interval it checks that trigger with its interval value.
*/

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
