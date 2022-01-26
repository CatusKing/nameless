const { exec } = require("child_process");

module.exports = {
	name: 'pull',
	description: 'Pulls the latest code from the repo',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.user.id === '473110112844644372') {
      exec('git pull', (err => console.error(err)));
      exec('npm i', (err => console.error(err)));
      interaction.reply('pog i think it worked');
    } else interaction.reply('no');
  }
};