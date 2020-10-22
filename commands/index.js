const advice = require('./advice.js');
const kys = require('./kys.js');
const shame = require('./shame.js');
const help = require('./help.js');
const patchNotes = require('./patchNotes.js');
const names = require('./names.js');
const bugs = require('./bugs.js');
const echo = require('./echo.js');
const taboo = require('./taboo.js');
const roll = require('./roll.js');
const blackjack = require('./blackjack.js');
const events = require('./events.js');
const mute = require('./mute.js');
const meme = require('./meme.js');
const shorthand = require('./shorthand.js');
const default_ = require('./default.js');

/**
* Commands are for actions that are invoked by users by saying @Bot [command].
*
* Commands should export their run function, which should return True if the
* command was invoked and False if the command was not invoked.
*/

const commandArray = [
	advice,
	kys,
	shame,
	help,
	patchNotes,
	names,
	bugs,
	echo,
	taboo,
	roll,
	blackjack,
	events,
	mute,
	meme,
	shorthand,
	default_
];

const run = (state) => {
	commandArray.find(
		(f) => f(state)
	);
}

module.exports=run;
