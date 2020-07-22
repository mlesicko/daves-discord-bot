const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 === 'mocking' || token0 === 'spongebob') {
		return makeMessageMocking(state, tokens.slice(1).join(' '));
	} else {
		return false;
	}
}

const makeMessageMocking = (state, messageText) => {
	const transformFn = (m) =>
		state.transformFn(m)
		.split('')
		.map((c,i) => i%3 ? c.toLowerCase() : c.toUpperCase())
		.join('');
    return {
		...state,
		transformFn,
		messageText,
	};
}

module.exports=run;
