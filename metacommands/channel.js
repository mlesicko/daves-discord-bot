const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 && token0.match(/^<#[0-9]+>$/)) {
		updateForChannel(
			getChannelById(token0.slice(2,-1), state),
			tokens.slice(1).join(' '),
			state
		);
		return true;
	} else {
		return false;
	}
}

const getChannelById = (channelId, state) => {
	const channel = state.message.mentions.channels.get(channelId);
	if (!channel) { //no such channel exists somehow
		state.message.channel.send(`I cannot find the channel ${channelId}.`);
		throw `Unable to find requested channel by id: ${channelId}`;
	}
	return channel;
}

const updateForChannel = (channel, messageText, state) => {
	state.sendFn = (message) => channel.send(message);
	state.channel = channel;
	state.messageText = messageText;
}

module.exports=run;
