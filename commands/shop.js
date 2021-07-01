const config = require('../general/config.json');
module.exports = {
	name: 'shop',
	description: 'Displays what you can use your points for',
	usage: `shop`,
	command: true,
	aliases: ['shop'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned) {
		var description = '';
		for (let i = 0; i < config.shop.length; ++i) description += `\n${config.shop[i][0]}`;
		reply(msg.channel.id, description, '#9e9d9d');
	}
};