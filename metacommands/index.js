const quietly = require('./quietly.js');
const loudly = require('./loudly.js');

const metacommandArray = [
	quietly,
	loudly,
];

const run = (state) => {
	for (const metacommand of metacommandArray) {
		result = metacommand(state);
		if (result) {
			return result;
		}
	}
	return state;
}

module.exports=run;
