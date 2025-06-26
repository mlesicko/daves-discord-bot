const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../errorLogging.js');
const { with_silent, apply_silent } = require('./slashCommandTools');
const { getRandInt } = require('../utils.js');

const data = new SlashCommandBuilder()
	.setName("name")
	.setDescription("Important names")
	.addSubcommand(subcommand =>
		with_silent(subcommand
			.setName("random")
			.setDescription("Get a random name")))
	.addSubcommand(subcommand => subcommand
		.setName("add")
		.setDescription("Save an important name for later")
		.addStringOption(option =>
			option.setName("name")
				.setDescription("The name to save")
				.setRequired(true)))
	.toJSON();

const run = ({interaction, db}) => {
	const name = interaction.options.getString("name");
	const subcommand = interaction.options.getSubcommand();
	let response = "Error handling request";
	if (subcommand === "random") {
		response = get_name(db);
	} else if (subcommand === "add") {
		response = add_name(name, db);
	}
	interaction.reply(apply_silent(interaction, response));
}

const add_name = (name, db) => {
	db.push('/names', [name], false);
	return "Added name: " + name;
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
