const { SlashCommandBuilder } = require('@discordjs/builders');
const { PATCH_NOTES } = require("../assets/strings.js");

const data = new SlashCommandBuilder()
	.setName("patch_notes")
	.setDescription("Print latest patch notes.")
	.toJSON();

const run = ({interaction}) => {
	interaction.reply(PATCH_NOTES);
}

module.exports={ run, data };
