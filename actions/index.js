const sixtyNine = require('./sixtyNine.js');
const oldTownRoad = require('./oldTownRoad.js');
const shame = require('./shame.js');

const commandArray = [
	shame,
	sixtyNine,
	oldTownRoad
];

const run = (state) => {
	const selection = commandArray.find(
		(f) => f(state)
	);
	if (selection) {
		return true;
	} else {
		return false;
	}
}

module.exports=run;
