module.exports = {
	name: 'balance',
	description: 'Allows you to look at your or another users balance',
	execute(msg, reply, getUserBalance, floor) {
    const target = msg.mentions.users.first() || msg.author;
    return reply(msg.channel.id, `${target} has ${floor(getUserBalance(target.id))}🦴(${getUserBalance(target.id)}🦴)`, '#ffffba');
  }
};