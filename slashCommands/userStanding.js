const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../errorLogging.js');

const shame_data = new SlashCommandBuilder()
	.setName("shame")
	.setDescription("Shame a user.")
	.addUserOption(option =>
		option.setName("user")
			.setDescription("The user to shame")
			.setRequired(true))
	.toJSON();

const praise_data = new SlashCommandBuilder()
	.setName("praise")
	.setDescription("Praise a user")
	.addUserOption(option =>
		option.setName("user")
			.setDescription("The user to praise")
			.setRequired(true))
	.toJSON();

const shame_run = ({interaction, db}) => {
	const channel_id = interaction.channelId;
	const user = interaction.options.getUser("user");
	interaction.reply(adjust_standing(db, user, channel_id, -1));
}

const praise_run = ({interaction, db}) => {
	const channel_id = interaction.channelId;
	const user = interaction.options.getUser("user");
	interaction.reply(adjust_standing(db, user, channel_id, 1));
}

const adjust_standing = (db, user, channel_id, delta) => {
	const success_responses = {
		[-1]: `${user.username} is shamed.`,
		[0]: `${user.username} has been reset to normal.`,
		[1]: `${user.username} is praised.`
	};
	try {
		const standing = db.getData("/user_standing/");
		const current_user_standing = standing?.[channel_id]?.[user.id];
		if (current_user_standing) {
			const adjusted_standing = current_user_standing + delta;
			if (adjusted_standing > 1) {
				return `${user.username} is already praised.`;
			} else if (adjusted_standing < -1) {
				return `${user.username} is already shamed.`;
			} else {
				db.push(`/user_standing/${channel_id}/${user.id}`, adjusted_standing);
				return success_responses[adjusted_standing];
			}
		} else {
			db.push(`/user_standing/${channel_id}/${user.id}`, delta);
			return success_responses[delta];
		}
	} catch (e) {
		db.push(`/user_standing/${channel_id}/${user.id}`, delta);
		return success_responses[delta];
	}
}

module.exports=[
	{run: shame_run, data: shame_data},
	{run: praise_run, data: praise_data}
];
