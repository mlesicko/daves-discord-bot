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
	const transformMessage = (m) => state.transformMessage(m).toUpperCase();
	const sendMessage = (message) => state.sendMessage(transformMessage(message));
    return {
		...state,
		transformMessage,
		messageText,
		sendMessage
	};
}

module.exports=run;
