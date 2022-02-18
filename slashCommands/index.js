const { arrayToObj } = require('../utils.js');

const registerSlashCommands = require('./registerSlashCommands.js');

const advice = require('./advice.js');
const bugs = require('./bugs.js');
const echo = require('./echo.js');
const events = require('./events.js');
const emojiUsage = require('./emojiUsage.js');
const mute = require('./mute.js');
const names = require('./names.js');
const patchNotes = require('./patchNotes.js');
const roll = require('./roll.js');
const taboo = require('./taboo.js');


const slashCommandsArray = [
	advice,
	bugs,
	echo,
	emojiUsage,
	events,
	mute,
	names,
	patchNotes,
	roll,
	taboo,
];

const slashCommandsObj =
	arrayToObj(slashCommandsArray, (comm) => comm.data.name);

const run = (state) => {
	slashCommandsObj[state.interaction.commandName]?.run?.(state);
}

registerSlashCommands(slashCommandsArray.map((comm) => comm.data));

module.exports=run;
