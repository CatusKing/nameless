const { prefix } = require('../general/config.json');
module.exports = {
	name: 'add',
	description: 'Adds to the users balance',
	execute(msg, args, reply, log, addUserBalance) {
    if (msg.member.roles.cache.has('830496065366130709')) {
      const target = msg.mentions.users.first() || msg.author;
  
      if (isNaN(args[0])) return reply(msg.channel.id, `Sorry you need to use the command like this ${prefix}add <amount> [@User]`, '#9e9d9d');
      const amount = Math.floor(args[0]);
      const balance = addUserBalance(target.id, amount);
      addUserBalance('bank', -amount);
      reply(msg.channel.id, `Given ${amount}🦴 to ${target}\nThey now have ${balance}🦴`, '#baffc9');
      log('830503210951245865', `+${amount}🦴 to ${target} given by ${msg.author}`, '#baffc9');
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  }
};