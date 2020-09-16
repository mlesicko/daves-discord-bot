const quietly = require('./quietly.js');
const loudly = require('./loudly.js');
const channel = require('./channel.js');
const mocking = require('./mocking.js');
const replaceShorthands = require('./replaceShorthands');

const metacommandArray = [
	quietly,
	loudly,
	channel,
	mocking,
];

const run = (state) => {
	state.transformFn = (s) => s;
	state.sendFn = (s) => state.message.channel.send(s);
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
	state = replaceShorthands(state);
	state.sendMessage = (m) => m && state.sendFn(state.transformFn(m));
	return state;
}

module.exports=run;
