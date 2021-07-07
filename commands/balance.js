module.exports = {
	name: 'balance',
	description: 'Allows you to look at your or another users balance',
  usage: `balance [@User]`,
  command: true,
  aliases: ['balance', 'bal'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    const target = msg.mentions.users.first() || msg.author;
    return reply(msg.channel.id, `${target} has ${floor(getUserBalance(target.id))}🦴(${getUserBalance(target.id)}🦴)`, '#ffffba');
  }
};