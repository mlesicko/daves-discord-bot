const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 === 'quietly' || token0 === 'silently') {
		silenceMessage(state, tokens.slice(1).join(' '));
		return true;
	} else {
		return false;
	}
}

const silenceMessage = (state, messageText) => {
	state.message.react('👍')
	state.applyTransformFn((message) => '');
	state.messageText = messageText;
}

module.exports=run;
