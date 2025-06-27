const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../errorLogging.js');
const { getRandInt } = require('../utils.js');

const data = new SlashCommandBuilder()
	.setName("plate")
	.setDescription("Vanity plates")
	.addSubcommand(subcommand => subcommand
		.setName("random")
		.setDescription("Get a random vanity plate"))
	.addSubcommand(subcommand => subcommand
		.setName("add")
		.setDescription("Save a vanity plate")
		.addStringOption(option =>
			option.setName("plate")
				.setDescription("The plate to save")
				.setRequired(true)))
	.toJSON();

const run = async ({interaction, db}) => {
	const plate = interaction.options.getString("plate");
	const subcommand = interaction.options.getSubcommand();
	let response = "Error handling request";
	if (subcommand === "random") {
		response = await get_plate(db);
	} else if (subcommand === "add") {
		response = add_plate(plate, db);
	}
	interaction.reply(response);
}

const add_plate = (plate, db) => {
	db.push('/plates', [plate], false);
	return "Added plate: " + plate;
}

const get_plate = async (db) => {
	try {
		const plates = await db.getData('/plates');
		if (plates && plates.length > 0) {
			const i = getRandInt(plates.length);
			return plates[i];
		} else {
			return 'I haven\'t seen any plates.';
		}
	} catch (e) {
		logError(e);
		return 'I haven\'t seen any plates.';
	}
}

module.exports={ run, data };
