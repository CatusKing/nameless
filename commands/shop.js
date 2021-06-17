const config = require('../general/config.json');
module.exports = {
	name: 'shop',
	description: 'Displays what you can use your points for',
	execute(msg, reply) {
		var description = '';
		for (let i = 0; i < config.shop.length; ++i) description += `\n${config.shop[i][0]}`;
		reply(msg.channel.id, description, '#9e9d9d');
	}
};