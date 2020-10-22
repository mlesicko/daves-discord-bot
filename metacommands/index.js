const quietly = require('./quietly.js');
const loudly = require('./loudly.js');
const channel = require('./channel.js');
const mocking = require('./mocking.js');
const uwu = require('./uwu.js');
const replaceShorthands = require('./replaceShorthands');

/**
* Metacommands alter the way a command will be executed. They should be
* invoked in the form @Bot [metacommands...] [command].
*
* Metacommands should export their run function. If the metacommand was
* invoked, this function should update the state object to appropriately
* alter the way the command will be executed and return true, otherwise
* it should return false.
*
* replaceShorthands is a special metacommand that will always be executed
* last. This will replace any shorthands in the message with their expanded
* form. This metacommand needs to be evaluated last because of its secondary
* function: if the shorthand is the entire text of the message, after
* evauating any other metacommands, it will function as an echo command.
* For example, if !foo is a shorthand for "foo bar", the command
* @Bot loudly !foo
* will cause the bot to print
* "FOO BAR"
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
	replaceShorthands(state);
	return state;
}

module.exports=run;
