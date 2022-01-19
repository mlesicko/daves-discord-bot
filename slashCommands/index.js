const { arrayToObj } = require('../utils.js');

const registerSlashCommands = require('./registerSlashCommands.js');

const patchNotes = require('./patchNotes.js');
const emojiUsage = require('./emojiUsage.js');
const getName = require('./names/getName.js');
const addName = require('./names/addName.js');


const slashCommandsArray = [
	patchNotes,
	emojiUsage,
	getName,
	addName,
];

const slashCommandsObj =
	arrayToObj(slashCommandsArray, (comm) => comm.data.name);

const run = (state) => {
	slashCommandsObj[state.interaction.commandName]?.run?.(state);
}

registerSlashCommands(slashCommandsArray.map((comm) => comm.data));

module.exports=run;
