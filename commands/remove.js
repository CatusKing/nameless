const { prefix } = require('../general/config.json');
module.exports = {
	name: 'remove',
	description: 'Removes from the users balance',
  usage: `remove <amount> [@User]`,
  command: true,
  aliases: ['remove'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance) {
    if (msg.member.roles.cache.has('830496065366130709')) {
      const target = msg.mentions.users.first() || msg.author;
  
      if (isNaN(args[0])) return reply(msg.channel.id, `Sorry you need to use the command like this ${prefix}remove <amount> [@User]`, '#9e9d9d');
      const amount = Math.floor(args[0]);
      const balance = addUserBalance(target.id, -amount);
      addUserBalance('bank', amount);
      reply(msg.channel.id, `Taken ${amount}🦴 from ${target}\nThey now have ${balance}🦴`, '#ff7784');
      log('830503210951245865', `+${amount}🦴 to ${target} given by ${msg.author}`, '#ff7784');
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  }
};