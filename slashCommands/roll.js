const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName("roll")
	.setDescription("Roll some dice.")
	.addIntegerOption(option =>
		option.setName("count")
			.setDescription("The number of dice to roll")
			.setMinValue(0)
			.setRequired(false))
	.addIntegerOption(option =>
		option.setName("sides")
			.setDescription("The number of sides on the dice")
			.setMinValue(1)
			.setRequired(false))
	.toJSON();

const run = ({interaction}) => {
	const count = interaction.options.getInteger("count") ?? 1;
	const sides = interaction.options.getInteger("sides") ?? 6;
	interaction.reply(rollDice(count, sides));
}

const rollDice = (count, sides) => {
	let message = `Rolling ${count}d${sides}\n`;
	const results = [];
	for (let i=0; i<count; i++) {
		results[i] = rollDie(sides);
	}
	message += count > 100 ? '' :
		`Result${count < 2 ? '' : 's'}: ${results.join(', ')}\n`;
	message += count === 1 ? '' :
		`Total: ${results.reduce((x,y) => x + y, 0)}`;
	return message;
}

const rollDie = (n) => Math.floor(Math.random() * n) + 1;

module.exports={ run, data };
