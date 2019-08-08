const sixtyNine = require('./sixtyNine.js');
const oldTownRoad = require('./oldTownRoad.js');

const commandArray = [
	sixtyNine,
	oldTownRoad
];

const run = (messageText, actions, message) => {
	const selection = commandArray.find(
		(f) => f(messageText, actions, message)
	);
	if (selection) {
		return true;
	} else {
		return false;
	}
}

module.exports=run;
