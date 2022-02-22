const quietly = require('./quietly.js');
const loudly = require('./loudly.js');
const channel = require('./channel.js');
const mocking = require('./mocking.js');
const uwu = require('./uwu.js');

/**
* Metacommands alter the way a command will be executed. They should be
* invoked in the form @Bot [metacommands...] [command].
*
* Metacommands should export their run function. If the metacommand was
* invoked, this function should update the state object to appropriately
* alter the way the command will be executed and return true, otherwise
* it should return false.
*/

const metacommandArray = [
	quietly,
	loudly,
	channel,
	mocking,
	uwu,
];

const run = (state) => {
	let updated = true;
	while(updated) {
		updated = false;
		for (const metacommand of metacommandArray) {
			if (metacommand(state)) {
				updated = true;
			}
		}
	}
	return state;
}

module.exports=run;
