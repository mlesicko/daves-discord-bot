const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 === 'mocking' || token0 === 'spongebob') {
		makeMessageMocking(state, tokens.slice(1).join(' '));
		return true;
	} else {
		return false;
	}
}

const makeMessageMocking = (state, messageText) => {
	const transformFn = (m) =>
		m
		.split('')
		.map((c,i) => i%3 ? c.toLowerCase() : c.toUpperCase())
		.join('');
	state.applyTransformFn(transformFn);
	state.messageText = messageText;
}

module.exports=run;
