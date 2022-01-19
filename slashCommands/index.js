const { arrayToObj } = require('../utils.js');

const registerSlashCommands = require('./registerSlashCommands.js');

const patchNotes = require('./patchNotes.js');
const emojiUsage = require('./emojiUsage.js');
const names = require('./names.js');
const events = require('./events.js');


const slashCommandsArray = [
	patchNotes,
	emojiUsage,
	names,
	events,
];

const slashCommandsObj =
	arrayToObj(slashCommandsArray, (comm) => comm.data.name);

const run = (state) => {
	slashCommandsObj[state.interaction.commandName]?.run?.(state);
}

registerSlashCommands(slashCommandsArray.map((comm) => comm.data));

module.exports=run;
