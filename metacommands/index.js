const quietly = require('./quietly.js');
const loudly = require('./loudly.js');
const channel = require('./channel.js');
const mocking = require('./mocking.js');
const replaceShorthands = require('./replaceShorthands');

/**
* Metacommands alter the way a command will be executed. They should be
* invoked in the form @Bot [metacommands...] [command].
*
* Metacommands should export their run function. If the metacommand was
* invoked, this function should return an updated state that will appropriately
* alter the way the command will be executed, otherwise it should return false.
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
