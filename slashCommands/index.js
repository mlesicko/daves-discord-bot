const patchNotes = require('./patchNotes.js');
const emojiUsage = require('./emojiUsage.js');
const registerSlashCommands = require('./registerSlashCommands.js');

const slashCommands = {
	"patch_notes": patchNotes,
	"emoji_usage": emojiUsage
};

const run = (state) => {
	slashCommands[state.interaction.commandName]?.run?.(state);
}

registerSlashCommands(slashCommands);

module.exports=run;
