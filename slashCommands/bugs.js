const { SlashCommandBuilder } = require('@discordjs/builders');
const { logError } = require('../errorLogging.js');

const { with_silent, apply_silent } = require('./slashCommandTools');

const data = new SlashCommandBuilder()
	.setName("bug")
	.setDescription("Record and track bugs in the bot.")
	.addSubcommand(subcommand => 
		with_silent(subcommand
			.setName("report")
			.setDescription("report a bug")
			.addStringOption(option =>
				option.setName("description")
					.setDescription("A description of the bug")
					.setRequired(true))))
	.addSubcommand(subcommand =>
		with_silent(subcommand
			.setName("list")
			.setDescription("List reported bugs")))
	.addSubcommand(subcommand =>
		with_silent(subcommand
			.setName("resolve")
			.setDescription("Resolve a reported bug")
			.addIntegerOption(option =>
				option.setName("index")
					.setDescription("The index of the bug to resolve")
					.setRequired(true))
			.addStringOption(option =>
				option.setName("resolution")
					.setDescription("Optional resolution information")
					.setRequired(false))))
	.toJSON();

const run = async ({interaction, db}) => {
	const subcommand = interaction.options.getSubcommand();
	let response;
	if (subcommand === "report") {
		const description = interaction.options.getString("description");
		response = report_bug(db, description);
	} else if (subcommand === "list") {
		response = await list_bugs(db);
	} else if (subcommand === "resolve") {
		const index = interaction.options.getInteger("index");
		const resolution = interaction.options.getString("resolution");
		response = await resolve_bug(db, index, resolution);
	} else {
		response = "Error handling request";
	}
	interaction.reply(apply_silent(interaction, response));
}

const report_bug = (db, description) => {
	db.push("/bugs", [description], false);
	return `Reported bug: \`${description}\``;
}

const list_bugs = async (db) => {
	try {
		const bugs = await db.getData("/bugs");
		if (bugs && bugs.length > 0) {
			return bugs.map((bug, idx) => `${idx + 1}. ${bug}`).join("\n");
		} else {
			return "No bugs have been reported.";
		}
	} catch (e) {
		logError(e);
		return "No bugs have been reported.";
	}
}

const resolve_bug = async (db, index, resolution) => {
	const bugs = await db.getData("/bugs");
	if (index >= 1 && index <= bugs.length) {
		const removed_bug = bugs[index - 1]
		const updated_bugs = [...bugs.slice(0, index - 1), ...bugs.slice(index)]
		db.push("/bugs", updated_bugs, true);
		return `Resolved \`${removed_bug}\`${resolution ? `:\n${resolution}` : ""}`; 
	} else {
		return `Could not resolve bug: index ${index} out of range.`; 
	}
}

module.exports = { run, data };
