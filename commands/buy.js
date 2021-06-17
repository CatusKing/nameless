const config = require('../general/config.json');
const prefix = config.prefix;
module.exports = {
	name: 'buy',
	description: 'Allows you to buy items from the shop',
	execute(msg, args, reply, log, getUserBalance, addUserBalance) {
    const balance = getUserBalance(msg.author.id);

		if (!args[0]) return reply(msg.channel.id, `You can use ${prefix}shop to see what you can buy`, '#9e9d9d');

		var bought = false;

		for (let i = 0; i < config.shop.length; ++i) {
			if (args[0].toLowerCase() == config.shop[i][1]) {
				const role = msg.guild.roles.cache.get(config.shop[i][3]);

				if (balance < config.shop[i][2]) {
					reply(msg.channel.id, `You don't have enough funds for the ${role} role\nYou need ${config.shop[i][2]}🦴\nYou have ${balance}🦴`, '#9e9d9d');
					bought = true;
					break;
				}

				if (config.shop[i][4] == 0) {
					if (msg.member.roles.cache.has(config.shop[i][3])) {
						reply(msg.channel.id, `You already have ${role} you dumb`, '#9e9d9d');
						break;
					}
					msg.member.roles.add(role, `Bought ${role.name}`);
					log('830503210951245865', `-${config.shop[i][2]}🦴 to ${msg.author} for buying ${role}`, '#ff7784');
					reply(msg.channel.id, `You spent ${config.shop[i][2]}🦴\n${msg.author}, you now have ${role}`, '#ffffba');
					bought = true;
				} else {
					if (!msg.member.roles.cache.has(config.shop[i][3])) {
						reply(msg.channel.id, `You don't have ${role} you dumb`, '#9e9d9d');
						bought = true;
						break;
					}
					msg.member.roles.remove(role, `Paid to remove ${role.name}`);
					log('830503210951245865', `-${config.shop[i][2]}🦴 to ${msg.author} for removing ${role}`, '#ff7784');
					reply(msg.channel.id, `You spent ${config.shop[i][2]}🦴\n${msg.author}, you now have removed ${role}`, '#ffffba');
					bought = true;
				}
				addUserBalance(msg.author.id, -config.shop[i][2]);
				addUserBalance('bank', config.shop[i][2]);
				break;
			}
		}
		if (!bought) reply(msg.channel.id, `You need to enter a valid item\nThey can be found using ${prefix}shop`, '#9e9d9d');
  }
};