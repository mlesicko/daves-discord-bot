const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../errorLogging.js');

const data = new SlashCommandBuilder()
	.setName("taboo")
	.setDescription("Taboo inappropriate words.")
	.addSubcommand(subcommand => subcommand
		.setName("list")
		.setDescription("List the taboos in this channel."))
	.addSubcommand(subcommand => subcommand
		.setName("add")
		.setDescription("Add a taboo.")
		.addStringOption(option =>
			option.setName("taboo")
				.setDescription("The word to taboo")
				.setRequired(true)))
	.addSubcommand(subcommand => subcommand
		.setName("remove")
		.setDescription("Remove a taboo.")
		.addStringOption(option =>
			option.setName("taboo")
				.setDescription("The taboo to remove")
				.setRequired(true)))
	.toJSON();

const run = async ({interaction, db}) => {
	const channel_id = interaction.channelId;
	const taboo = interaction.options.getString("taboo")?.toLowerCase();
	const subcommand = interaction.options.getSubcommand();
	let response;
	if (subcommand === "list") {
		response = await list_taboos(db, channel_id);
	} else if (subcommand === "add") {
		response = add_taboo(db, taboo, channel_id);
	} else if (subcommand === "remove") {
		response = await remove_taboo(db, taboo, channel_id);
	} else {
		response = "Error handling request";
	}
	interaction.reply(response);
}

const list_taboos = async (db, channel_id) => {
	try {
		const taboo_words = await db.getData("/taboo/" + channel_id);
		if (taboo_words.length === 0) {
			return "No words are currently taboo in this channel.";
		} else {
			return "Taboo words in this channel: " + taboo_words.join(" ");
		}
	} catch (e) {
		logError(e);
		return "No words are currently taboo in this channel.";
	}
}

const add_taboo = (db, taboo, channel_id) => {
	try {
		db.push("/taboo/" + channel_id, [taboo], false);
		return `"${taboo}" is now taboo.`;
	} catch (e) {
		logError(e);
		return "There was an error.";
	}
}

const remove_taboo = async (db, taboo, channel_id) => {
    try {
        const taboo_words = await db.getData("/taboo/" + channel_id);
		if (taboo_words.includes(taboo)) {
			db.push("/taboo/" + channel_id,
				taboo_words.filter(word => word !== taboo),
				true
			);
			return `"${taboo}" is no longer taboo`;
		} else {
			return `"${taboo}" was not taboo.`;
		}
    } catch (e) {
        logError(e);
        return 'There was an error';
    }
}

module.exports={ run, data };
