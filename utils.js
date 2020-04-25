const objectMap = (obj, f) => {
	const newObj = {};
	Object.keys(obj).forEach((key) =>
		newObj[key] = f(key, obj[key])
	);
	return newObj;
}

module.exports = { objectMap };
