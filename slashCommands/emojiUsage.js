const description = "Get emoji usage data";

const run = ({interaction, client, db}) => {
	const reportType = interaction.options.getString("report");
	const emojiData = getEmojiData(interaction.guildId, db);

	if (emojiData.length === 0) {
		interaction.reply("No emoji data found");
		return;
	}

	interaction.reply(makeReport(emojiData, client));
}

const getEmojiData = (guild, db) => {
	try {
		return Object.values(db.getData(`/emojis/${guild}`));
	} catch (e) {
		return [];
	}
}
	
const formatDate = (timestamp) => {
	const date = new Date(timestamp);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const formatEmojiData = (emojiData, client) => { 
	const emoji = client.emojis.cache.find(emoji => emoji.name === emojiData.name);
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

module.exports={ description, run };
