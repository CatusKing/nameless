const { adminRoles } = require('../general/config.json');
module.exports = {
	name: 'admin',
	description: 'Toggles admin mode',
  usage: `admin`,
  command: true,
  aliases: ['admin'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins) {
		let yes = true;
    msg.member.roles.cache.forEach(r => {
      if (adminRoles.includes(r.id) && yes) {

        if (admins.includes(msg.author.id)) {
          for (var i = 0; i < admins.length; i++) {
  
            if (admins[i] == msg.author.id) {
              admins.splice(i, 1);
              reply(msg.channel.id, `No longer ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
              break;
            }
          }
        } else {
          admins.push(msg.author.id);
          reply(msg.channel.id, `Ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
        }
        setServerAdmins(admins);
        !yes;
        return admins;
      }
    });
    if (yes) reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
	},
};