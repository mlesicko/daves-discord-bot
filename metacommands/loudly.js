const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 === 'loudly') {
		return makeMessageLoud(state, tokens.slice(1).join(' '));
	} else {
		return false;
	}
}

const makeMessageLoud = (state, messageText) => {
	const sendMessage = (message) => state.sendMessage(message.toUpperCase());
    return {
		...state,
		messageText,
		sendMessage
	};
}

module.exports=run;
