const sixtyNine = require('./sixtyNine.js');
const oldTownRoad = require('./oldTownRoad.js');
const userStanding = require('./userStanding.js');
const taboo = require('./taboo.js');
const leaf = require('./leaf.js');
const named = require('./named.js');
const enjoyMeme = require('./enjoyMeme');
const macros = require('./macros.js');
const pleaseClap = require('./pleaseClap.js');

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
	pleaseClap,
	macros,
	userStanding,
	taboo,
	named,
	// Non-blocking
	sixtyNine,
	oldTownRoad,
	leaf,
	enjoyMeme
];

const run = async (state) => {
	for (const command of commandArray) {
		if (await command(state)) {
			return;
		}
	}
}

module.exports=run;
