const kys = require('./kys.js');
const bugs = require('./bugs.js');
const blackjack = require('./blackjack.js');
const default_ = require('./default.js');

/**
* Commands are for actions that are invoked by users by saying @Bot [command].
*
* Commands should export their run function, which should return True if the
* command was invoked and False if the command was not invoked.
*/

const commandArray = [
	kys,
	bugs,
	blackjack,
	default_
];

const run = (state) => {
	commandArray.find(
		(f) => f(state)
	);
}

module.exports=run;
