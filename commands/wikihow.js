const request = require('request');
module.exports = {
	name: 'wikihow',
	description: 'Retrieves a random WikiHow image',
  usage: `wikihow`,
  command: true,
  aliases: ['wikihow'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    request('http://www.wikihow.com/Special:Randomizer', { json: true }, (err, res, body) => {
      if (err) console.warn(err);
      console.log(body.title);
    });
  }
};