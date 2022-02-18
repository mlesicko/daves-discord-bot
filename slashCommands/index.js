const { arrayToObj } = require('../utils.js');

const registerSlashCommands = require('./registerSlashCommands.js');

const patchNotes = require('./patchNotes.js');
const emojiUsage = require('./emojiUsage.js');
const names = require('./names.js');
const events = require('./events.js');
const echo = require('./echo.js');
const roll = require('./roll.js');


const slashCommandsArray = [
	patchNotes,
	emojiUsage,
	names,
	events,
	echo,
	roll,
];

const slashCommandsObj =
	arrayToObj(slashCommandsArray, (comm) => comm.data.name);

const run = (state) => {
	slashCommandsObj[state.interaction.commandName]?.run?.(state);
}

registerSlashCommands(slashCommandsArray.map((comm) => comm.data));

module.exports=run;
