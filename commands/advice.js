const request = require('request');
module.exports = {
	name: 'advice',
	description: 'Gives funky advice',
  usage: `advice`,
  command: true,
  aliases: ['advice'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned) {
    request(`https://api.adviceslip.com/advice`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      reply(msg.channel.id, body.slip.advice, '#9e9d9d');
    });
  }
};