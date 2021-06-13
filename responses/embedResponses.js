const enjoyMeme = require('./enjoyMeme');

/**
* Some responses need to fire when Discord changes the embeds on a message
* automatically, without the user performing an edit. Only those responses
* should go in this file.
*
* All responses in this file should be idempotent, because they may be fired
* multiple times for the same message without user involvement.
*/

const commandArray = [
	enjoyMeme
];

const run = (state) => {
	commandArray.find(
		(f) => f(state)
	);
}

module.exports=run;
