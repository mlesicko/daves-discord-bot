const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../../errorLogging.js');

const data = new SlashCommandBuilder()
	.setName("add_name")
	.setDescription("Save an important name for later")
	.addStringOption(option => 
		option.setName("name")
			.setDescription("The name to save")
			.setRequired(true))
	.toJSON();

const run = ({interaction, db}) => {
	const name = interaction.options.getString("name");
	db.push('/names', [name], false);
	interaction.reply('Added name: ' + name);
}

module.exports={ run, data };
