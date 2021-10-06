const description = "Get emoji usage data";

const run = ({interaction, client, db}) => {
	const reportType = interaction.options.getString("report");
	const emojiData = getEmojiData(interaction.guildId, db);

	if (emojiData.length === 0) {
		interaction.reply("No emoji data found");
		return;
	} else {
		interaction.reply("Generating report...");
		client.channels.fetch(interaction.channelId).then((channel) => {
			const send = (s) => channel.send(s);
			partitionReplies(makeReport(emojiData, client), send);
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

const makeReport = (data, client) => {
	const sortedData = data.sort((e1, e2) => e2.last_used - e1.last_used);
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

module.exports={ description, run };
