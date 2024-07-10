const { SlashCommandBuilder } = require('@discordjs/builders');

const MOST_RECENT = "most_recent";
const MOST_POPULAR = "most_popular";

const data = new SlashCommandBuilder()
	.setName("emoji_usage")
	.setDescription("Get emoji usage data")
	.addStringOption(option =>
		option.setName("report-type")
			.setDescription("Type of emoji report to generate")
			.addChoices(
				{ name: "Most Recent", value: MOST_RECENT },
				{ name: "Most Popular", value: MOST_POPULAR }
			)
			.setRequired(false))
	.toJSON();

const run = ({interaction, client, db}) => {
	const reportType = interaction.options.getString("report-type") ?? MOST_POPULAR;
	const emojiData = getEmojiData(interaction.guildId, db);

	if (emojiData.length === 0) {
		interaction.reply("No emoji data found");
		return;
	} else {
		interaction.reply("Generating report...");
		client.channels.fetch(interaction.channelId).then((channel) => {
			const send = (s) => channel.send(s);
			partitionReplies(makeReport(emojiData, reportType, client), send);
		});
	}
}

const getEmojiData = (guild, db) => {
	try {
		const emojiObject = db.getData(`/emojis/${guild}`);
		return Object.keys(emojiObject).map((key) => ({
			id: key,
			...emojiObject[key]
		}));
	} catch (e) {
		return [];
	}
}
	
const formatDate = (timestamp) => {
	const date = new Date(timestamp);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const formatEmojiData = (emojiData, client) => { 
	const emoji = client.emojis.cache.get(emojiData.id);
	if (emoji) {
		return `${emoji} ` +
			`\`:${emojiData.name}:\` — ` +
			`Uses: ${emojiData.count} — ` +
			`Last used: ${formatDate(emojiData.last_used)}\n`;
	} else {
		return "";
	}
}

const makeReport = (data, reportType, client) => {
	const sortFunction = {
		[MOST_POPULAR]: (e1, e2) => e2.count - e1.count,
		[MOST_RECENT]: (e1, e2) => e2.last_used - e1.last_used,
	}[reportType];
	const sortedData = data.sort(sortFunction);
	return sortedData.map((e) => formatEmojiData(e, client)).join('');
}

const partitionReplies = (message, send, partitionMaxLength = 1000) => {
	const lines = message.split('\n').filter((s) => s.length > 0);
	let partition = '';
	lines.forEach((line) => {
		if (partition.length + line.length > partitionMaxLength) {
			send(partition);
			partition = line;
		} else {
			partition += '\n' + line;
		}
	});
	if (partition.length > 0) {
		send(partition);
	}
}

module.exports={ run, data };
