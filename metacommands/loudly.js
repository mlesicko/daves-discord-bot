const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 === 'loudly') {
		makeMessageLoud(state, tokens.slice(1).join(' '));
		return true;
	} else {
		return false;
	}
}

const makeMessageLoud = (state, messageText) => {
	state.applyTransformFn((message) => message.toUpperCase());
	state.messageText = messageText;
}

module.exports=run;
