const run = async ({message, react, db}) => {
	const memeChannels = await getMemeChannels(db);
	const channelId = message.channel.id;
	if (memeChannels.includes(channelId) && isMeme(message)) {
		react('😆');
	}
	return false;
}

const getMemeChannels = async (db) => {
	try {
		return await db.getData('/memeChannels');
	} catch (e) {
		return [];
	}
}

const isMeme = (message) =>
	message.attachments.size > 0 || message.embeds.length > 0;

module.exports=run;
