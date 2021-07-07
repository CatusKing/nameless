module.exports = {
	name: 'status',
	description: 'Updates the bots status',
  usage: `status`,
  command: true,
  aliases: ['status'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus) {
    if (msg.member.roles.cache.has('830496065366130709')) {
      updateStatus();
      reply(msg.channel.id, `Updated the status`, `#9e9d9d`);
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  }
};