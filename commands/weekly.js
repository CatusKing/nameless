const { weeklyAmount } = require('../general/config.json');
module.exports = {
	name: 'weekly',
	description: 'Claim your weekly reward',
  usage: `weekly`,
  command: true,
  aliases: ['weekly'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned) {
    const weekly = getUserWeekly(msg.author.id);

    if (weekly <= hours(Date.now())) {
      addUserBalance(msg.author.id, weeklyAmount);
      addUserBalance('bank', -weeklyAmount);
      setUserWeekly(msg.author.id, hours(Date.now()) + 167);
      reply(msg.channel.id, `${msg.author} just claimed ${weeklyAmount}🦴 for the week`, '#baffc9');
      log('830503210951245865', `+${weeklyAmount}🦴 to ${msg.author} for their weekly claim`, '#baffc9');
    } else {
      let result = weekly - hours(Date.now());

      if (result > 24) result = `${Math.floor(result / 24) + 1} days`;
      else if (result == 1) result = `${result} hour`;
      else result = `${result} hours`;
      reply(msg.channel.id, `${msg.author} you have already claimed for this week\nYou can claim again in ${result}`, '#9e9d9d');
    }
  }
};