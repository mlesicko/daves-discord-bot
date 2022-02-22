const { SlashCommandBuilder } = require('@discordjs/builders');

const { with_transform, apply_transform } = require('./slashCommandTools.js');

const data = 
	with_transform(
		new SlashCommandBuilder()
			.setName("echo")
			.setDescription("Make the bot speak some text.")
			.addStringOption(option =>
				option.setName("text")
					.setDescription("The text to echo")
					.setRequired(true))
			.addChannelOption(option =>
				option.setName("channel")
					.setDescription("The channel to echo on")
					.setRequired(false)))
	.toJSON();

const run = ({interaction}) => {
	interaction.reply({ content: "I will lend you my voice.", ephemeral: true });

	const channel = interaction.options.getChannel("channel");
	const text = interaction.options.getString("text");
	const response = apply_transform(interaction, text);
	if (channel !== null) {
		channel.send(response);
	} else {
		interaction.channel.send(response);
	}
}

module.exports={ run, data };
