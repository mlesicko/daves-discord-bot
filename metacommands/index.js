const quietly = require('./quietly.js');
const loudly = require('./loudly.js');
const channel = require('./channel.js');

const metacommandArray = [
	quietly,
	loudly,
	channel,
];

const run = (state) => {
	let updated = true;
	while(updated) {
		updated = false;
		for (const metacommand of metacommandArray) {
			result = metacommand(state);
			if (result) {
				state = result;
				updated = true;
			}
		}
	}
	return state;
}

module.exports=run;
