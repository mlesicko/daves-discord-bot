const sixtyNine = require('./sixtyNine.js');
const oldTownRoad = require('./oldTownRoad.js');
const shame = require('./shame.js');
const taboo = require('./taboo.js');
const leaf = require('./leaf.js');
const named = require('./named.js');

/**
* Responses are for anything the bot does in response to Discord messages
* that are not commands.
*
* Responses should export their run function. This function should return
* True if they were invoked and want to block any subsequent responses from
* firing, or False if they were not invoked or were invoked but do not need
* to block subsequent responses.
*/

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
