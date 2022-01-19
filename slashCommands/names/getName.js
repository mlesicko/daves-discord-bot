const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../../errorLogging.js');
const { getRandInt } = require('../../utils.js');

const data = new SlashCommandBuilder()
	.setName("name")
	.setDescription("Get a random name")
	.toJSON();

const run = ({interaction, db}) => {
	interaction.reply(get_name(db));
}

const get_name = (db) => {
	try {
		const names = db.getData('/names');
		if (names && names.length > 0) {
			const i = getRandInt(names.length);
			return names[i];
		} else {
			return 'I don\'t know any names.';
		}
	} catch (e) {
		logError(e);
		return 'I don\'t know any names.';
	}
}

module.exports={ run, data };
