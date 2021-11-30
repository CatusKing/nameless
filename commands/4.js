const { four } = require('../general/token.json');
module.exports = {
	name: '4',
	description: 'Yes',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const date = new Date();
    if (interaction.user.id === '576154421579481090' && date.getDate() === 19 && date.getMonth() === 11) {
      interaction.reply(four);
    } else interaction.reply('not yet');
  }
};