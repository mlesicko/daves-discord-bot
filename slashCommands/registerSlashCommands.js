const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { client_id, guild_id } = require('../env.json');
const { token } = require('../auth.json');

const rest = new REST({ version: '9' }).setToken(token);

const getSlashCommandJson = (slashCommands) => 
	Object.entries(slashCommands).map(([key, value]) => ({
		name: key,
		description: value.description,
		options: value.options
	}));

const registerSlashCommands = async (slashCommands) => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(client_id, guild_id),
			{ body: getSlashCommandJson(slashCommands) },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}

module.exports=registerSlashCommands;
