const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../errorLogging.js');
const { getRandInt } = require('../utils.js');

const data = new SlashCommandBuilder()
	.setName("advice")
	.setDescription("Advice for life")
	.addSubcommand(subcommand => subcommand
		.setName("get")
		.setDescription("Get advice"))
	.addSubcommand(subcommand => subcommand
		.setName("add")
		.setDescription("Save a piece of advice for later")
		.addStringOption(option =>
			option.setName("advice")
				.setDescription("The advice to save")
				.setRequired(true)))
	.toJSON();

const run = ({interaction, db}) => {
	const advice = interaction.options.getString("advice");
	const subcommand = interaction.options.getSubcommand();
	let response = "Error handling request";
	if (subcommand === "get") {
		response = get_advice(db);
	} else if (subcommand === "add") {
		response = add_advice(advice, db);
	}
	interaction.reply(response);
}

const add_advice = (advice, db) => {
	db.push('/advice', [advice], false);
	return "Added advice: " + advice;
}

const get_advice = (db) => {
	try {
		const advice = db.getData('/advice');
		if (advice && advice.length > 0) {
			const i = getRandInt(advice.length);
			return advice[i];
		} else {
			return "I have no advice at this time.";
		}
	} catch (e) {
		logError(e);
		return "I have no advice at this time.";
	}
}

module.exports={ run, data };
