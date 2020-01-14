const sixtyNine = require('./sixtyNine.js');
const oldTownRoad = require('./oldTownRoad.js');
const shame = require('./shame.js');
const taboo = require('./taboo.js');
const minecraft = require('./minecraft.js');

const commandArray = [
	minecraft,
	shame,
	taboo,
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
