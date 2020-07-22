const sixtyNine = require('./sixtyNine.js');
const oldTownRoad = require('./oldTownRoad.js');
const shame = require('./shame.js');
const taboo = require('./taboo.js');
const leaf = require('./leaf.js');
const named = require('./named.js');

const commandArray = [
	// Blocking
	shame,
	taboo,
	named,
	// Non-blocking
	sixtyNine,
	oldTownRoad,
	leaf
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
