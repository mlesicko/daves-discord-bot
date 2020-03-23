const dns = require('dns');

const run = ({client, db}) => {
	getIp().then((ip) => {
		if (didIpChange(ip, db)) {
			updateIp(ip, client, db);
		}
	})
	.catch((e) => console.log(e));
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
	const minecraftChannel = client.channels.find(
		(channel) => channel.id === minecraft_channel_id
	);
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


module.exports=run;
