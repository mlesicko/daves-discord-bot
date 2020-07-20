const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 === 'quietly' || token0 === 'silently') {
		return silenceMessage(state, tokens.slice(1).join(' '));
	} else {
		return false;
	}
}

const silenceMessage = (state, messageText) => {
	const sendMessage = (message) => {}
    return {
		...state,
		messageText,
		sendMessage
	};
}

module.exports=run;
