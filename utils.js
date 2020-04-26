const objectMap = (obj, f) => {
	const newObj = {};
	Object.keys(obj).forEach((key) =>
		newObj[key] = f(key, obj[key])
	);
	return newObj;
}

const runAndSetInterval = (f, interval, ...args) => {
	f(...args);
	return setInterval(f, interval, ...args);
}

module.exports = { objectMap, runAndSetInterval };
