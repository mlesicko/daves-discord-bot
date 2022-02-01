const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName("echo")
	.setDescription("Make the bot speak some text.")
	.addStringOption(option =>
		option.setName("text")
			.setDescription("The text to echo")
			.setRequired(true))
	.addChannelOption(option =>
		option.setName("channel")
			.setDescription("The channel to echo on")
			.setRequired(false))
	.toJSON();

const run = ({interaction}) => {
	const channel = interaction.options.getChannel("channel");
	const text = interaction.options.getString("text");
	interaction.reply({ content: "I will lend you my voice.", ephemeral: true });
	if (channel !== null) {
		channel.send(text);
	} else {
		interaction.channel.send(text);
	}
}

module.exports={ run, data };
