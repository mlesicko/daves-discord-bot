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
	const transformFn = (m) => state.transformFn(m).toUpperCase();
    return {
		...state,
		transformFn,
		messageText,
	};
}

module.exports=run;
