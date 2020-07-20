const log = (msg) => {
	const timestamp = new Date().toLocaleString();
	console.log(timestamp);
	console.log(msg);
	console.log('-'.repeat(20));
}

const logError = (e) => {
	log(e);
}

const withErrorLogging = (f) => (...args) => {
	try {
		f(...args);
	} catch (e) {
		logError(e);
	}
}

module.exports = {log, logError, withErrorLogging}
