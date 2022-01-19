const arrayToObj = (l, key_f) => l.reduce((result, item) => {
	result[key_f(item)] = item;
	return result;
}, {});

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

const getRandInt = (n) => Math.floor(Math.random() * Math.floor(n));

module.exports = { arrayToObj, objectMap, runAndSetInterval, getRandInt };
