const { SlashCommandBuilder } = require('@discordjs/builders');
const { logError } = require('../errorLogging.js');

const { with_silent, apply_silent } = require('./slashCommandTools');

const data = new SlashCommandBuilder()
	.setName("macros")
	.setDescription(
		"Update or view the list of macros that can be invoked with ![macro]."
	)
	.addSubcommand(subcommand => subcommand
		.setName("create")
		.setDescription("Create a new macro")
		.addStringOption(option =>
			option.setName("name")
				.setDescription("The macro to create")
				.setRequired(true))
		.addStringOption(option =>
			option.setName("content")
				.setDescription("The content of the macro")
				.setRequired(true)))
	.addSubcommand(subcommand =>
		with_silent(subcommand
			.setName("list")
			.setDescription("List the registered macros")))
	.addSubcommand(subcommand => subcommand
		.setName("delete")
		.setDescription("Delete a macro")
		.addStringOption(option =>
			option.setName("name")
				.setDescription("The macro to delete")
				.setRequired(true)))
	.toJSON();

const run = async ({interaction, db}) => {
	const subcommand = interaction.options.getSubcommand();
	let response;
	if (subcommand === "create") {
		const name = interaction.options.getString("name");
		const content = interaction.options.getString("content");
		response = create_macro(db, name, content);
	} else if (subcommand === "list") {
		response = await list_macros(db);
	} else if (subcommand === "delete") {
		const name = interaction.options.getString("name");
		response = await delete_macro(db, name);
	} else {
		response = "Error handling request";
	}
	interaction.reply(apply_silent(interaction, response));
}

const ensure_bang = (s) => s[0] !== "!" ? "!" + s.trim() : s.trim();

const create_macro = (db, name, content) => {
	const macro = ensure_bang(name);
	if (macro.includes(' ')) {
		return "Error: unable to create macro. Macros must not contain spaces.";
	}
	db.push(`/macros/${macro}`, content, true);
	return `Created macro:\n${macro}: ${content}`;
}

const list_macros = async (db) => {
	try {
		const macros = await db.getData("/macros");
		const macro_names = Object.keys(macros);
		if (macro_names.length > 0) {
			return macro_names.join("\n");
		} else {
			return "There are no macros registered.";
		}
	} catch (e) {
		logError(e);
		return "There are no macros registered.";
	}
}

const delete_macro = async (db, name) => {
	const macro = ensure_bang(name);
	try {
		const macros = await db.getData("/macros");
		if (macro in macros) {
			delete macros[macro];
			db.push("/macros", macros, true);
			return `Removed macro "${macro}".`
		} else {
			return `Could not find registered macro "${macro}".`;
		}
	} catch (e) {
		logError(e);
		return "There are no macros registered.";
	}
}

module.exports = { run, data };
