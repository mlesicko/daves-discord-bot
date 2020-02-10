const dns = require('dns');


const run = ({messageText, sendMessage}) => {
	if (messageText.toLowerCase() === 'minecraft') {
		sendDnsInfo(sendMessage);
		return true;
	} else {
		return false;
	}
}

const sendDnsInfo = (sendMessage) => {
	dns.lookup('davehub.ddns.net', (err, address, family) => {
		sendMessage(
			'URL: davehub.ddns.net\n' +
			'Port: 19132\n' +
			'IP address (for Switch): ' + address
		);
	});
}

module.exports=run;
