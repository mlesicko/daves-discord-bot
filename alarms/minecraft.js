const dns = require('dns');
const { runAndSetInterval } = require('../utils.js');

const second = 1000;
const minute = second * 60;

let alarmInterval;

const start = (args) => {
	alarmInterval = runAndSetInterval(checkMinecraftIp, 10 * minute, args);
}

const stop = () => {
	if (alarmInterval != undefined) {
		clearInterval(alarmInterval)
	}
	alarmInterval = undefined;
}

const checkMinecraftIp = ({client, db, log}) => {
	getIp().then((ip) => {
		if (didIpChange(ip, db)) {
			updateIp(ip, client, db);
		}
		resetErrorCount(db);
	})
	.catch((e) => handleError(e, client, db, log));
	return false;
}

const minecraft_channel_id = '625806608949051413';

const getIp = () => {
	return dns.promises.lookup('davehub.ddns.net')
	.then((result) => result.address);
}

const didIpChange = (ip, db) => {
	return !(db.exists('/minecraft-ip') && db.getData('/minecraft-ip') === ip);
}

const updateIp = (ip, client, db) => {
	const minecraftChannel = getMinecraftChannel(client);
	minecraftChannel.send(
		`Alex's Minecraft server's IP address has changed.\n` +
		`The new IP address is ${ip}.\n` +
		`Please update accordingly.`
	);
	minecraftChannel.setTopic(
		`davehub.ddns.net:19132 || ${ip}`
	);
	db.push('/minecraft-ip', ip, true);
}

const handleError = (e, client, db, log) => {
	const failedChecks = (db.exists('/minecraft-failed-checks') &&
		db.getData('/minecraft-failed-checks')) || 0;
	if (failedChecks === 0) {
		db.push('/minecraft-failed-checks', 1, true);
	} else if (failedChecks === 1) {
		getMinecraftChannel(client).send(
			'I\'m having trouble reaching the Minecraft server:\n' + e
		);
		db.push('/minecraft-failed-checks', 2, true);
	}
	log(e);
}

const resetErrorCount = (db) => db.push('/minecraft-failed-checks', 0, true);

const getMinecraftChannel = (client) =>
	client.channels.find((channel) => channel.id === minecraft_channel_id);

module.exports={start, stop};
