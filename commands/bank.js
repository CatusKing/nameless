module.exports = {
	name: 'bank',
	description: 'Display\'s the bank\'s balance',
	execute(msg, reply, floor, getUserBalance) {
    reply(msg.channel.id, `The bank currently has ${floor(getUserBalance('bank'))}🦴(${getUserBalance('bank')}🦴)`, '#ffffba');
  }
};